import concurrent.futures
import json
import math
import time
import urllib.error
import urllib.request

BASE_URL = "http://localhost:8081"
CONCURRENCY = 20
TOTAL_ROUNDS = 100


def req(method: str, path: str, payload: dict | None = None):
    url = f"{BASE_URL}{path}"
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    headers = {"Content-Type": "application/json"} if payload is not None else {}
    r = urllib.request.Request(url, data=data, headers=headers, method=method)
    t0 = time.perf_counter()
    try:
        with urllib.request.urlopen(r, timeout=10) as resp:
            body = resp.read().decode("utf-8", errors="replace")
            dt_ms = (time.perf_counter() - t0) * 1000
            parsed = json.loads(body) if body else {}
            return resp.status, dt_ms, parsed
    except urllib.error.HTTPError as e:
        dt_ms = (time.perf_counter() - t0) * 1000
        return e.code, dt_ms, {}
    except Exception as e:
        dt_ms = (time.perf_counter() - t0) * 1000
        return 0, dt_ms, {"error": str(e)}


def percentile(values, p):
    if not values:
        return 0.0
    s = sorted(values)
    idx = max(0, min(len(s) - 1, math.ceil((p / 100.0) * len(s)) - 1))
    return s[idx]


def main():
    # 1. Create quiz, add question with valid DTO fields, and start quiz
    status, _, quiz_res = req("POST", "/api/quiz", {"title": "Load Test Quiz"})
    if status not in (200, 201):
        print(f"Failed to create quiz (HTTP {status}): {quiz_res}")
        return
    quiz_id = quiz_res.get("data", {}).get("id")
    print(f"Created quiz ID: {quiz_id}")

    q_payload = {
        "questionText": "What is 2 + 2?",
        "optionA": "2",
        "optionB": "3",
        "optionC": "4",
        "optionD": "5",
        "correctAnswer": "C",
    }
    q_status, _, q_res = req("POST", f"/api/question/quiz/{quiz_id}", q_payload)
    question_id = q_res.get("data", {}).get("id")
    print(f"Add question status: {q_status}, question ID: {question_id}")
    if q_status not in (200, 201) or not question_id:
        print("Aborting player load because question setup failed:", q_res)
        return

    start_status, _, _ = req("POST", f"/api/quiz/{quiz_id}/start")
    print(f"Start quiz status: {start_status}")

    latencies = []
    status_counts = {}
    per_route = {
        "join": [],
        "random_q": [],
        "submit": [],
        "leaderboard": [],
    }

    def record(route: str, code: int, ms: float):
        latencies.append(ms)
        status_counts[code] = status_counts.get(code, 0) + 1
        per_route[route].append((code, ms))

    def player_flow(i: int):
        # Join quiz (adjust if JoinQuizRequest uses different keys)
        join_payload = {"name": f"player_{i}", "username": f"player_{i}", "quizId": quiz_id}
        c1, ms1, j_res = req("POST", "/api/player/join", join_payload)
        record("join", c1, ms1)
        player_id = j_res.get("data", {}).get("id")

        # Fetch random question
        c2, ms2, rq_res = req("GET", f"/api/question/quiz/{quiz_id}/random")
        record("random_q", c2, ms2)
        fetched_q_id = rq_res.get("data", {}).get("id") or question_id

        # Submit answer
        if player_id is not None:
            sub_payload = {
                "playerId": player_id,
                "questionId": fetched_q_id,
                "selectedOption": "C",
            }
            c3, ms3, _ = req("POST", "/api/player/submit", sub_payload)
            record("submit", c3, ms3)

        # Read leaderboard
        c4, ms4, _ = req("GET", f"/api/player/quiz/{quiz_id}/leaderboard")
        record("leaderboard", c4, ms4)

    t_start = time.perf_counter()
    with concurrent.futures.ThreadPoolExecutor(max_workers=CONCURRENCY) as pool:
        futures = [pool.submit(player_flow, i) for i in range(TOTAL_ROUNDS)]
        for f in concurrent.futures.as_completed(futures):
            f.result()
    elapsed = time.perf_counter() - t_start

    total_reqs = len(latencies)
    rps = total_reqs / elapsed if elapsed > 0 else 0.0
    print("\n=== Load Test Summary ===")
    print(f"Duration:    {elapsed:.2f}s")
    print(f"Total Reqs:  {total_reqs}")
    print(f"Throughput:  {rps:.2f} req/s")
    print(f"p50 / p95 / p99 (ms): {percentile(latencies, 50):.1f} / {percentile(latencies, 95):.1f} / {percentile(latencies, 99):.1f}")
    print(f"Status codes: {status_counts}")
    for route, items in per_route.items():
        route_ms = [m for _, m in items]
        route_codes = {}
        for code, _ in items:
            route_codes[code] = route_codes.get(code, 0) + 1
        print(f"  {route:12s} | n={len(items):3d} | p50={percentile(route_ms, 50):5.1f}ms | p95={percentile(route_ms, 95):5.1f}ms | codes={route_codes}")


if __name__ == "__main__":
    main()