import assert from "node:assert/strict";
import { test } from "node:test";
import { toResult, toStartedAttempt } from "../src/app/dashboard/reading/_shared/api/reading-contract.ts";
import { getLoopbackApiUrl } from "../src/config/local-api.ts";

test("starts a Reading test using the separate attempt and passage DTOs", () => {
    const start = toStartedAttempt({
        id: "attempt-id",
        passageId: "passage-id",
        startedAt: "2026-11-22T12:00:00Z",
        expiresAt: "2026-11-22T12:20:00Z",
        serverNow: "2026-11-22T12:02:00Z",
        answers: [{ questionId: "tfng-id", selectedAnswer: "Not Given" }],
    }, {
        id: "passage-id",
        title: "Urban gardens",
        body: "The first paragraph.\r\n\r\nThe second paragraph.",
        questions: [
            { id: "completion-id", type: "SentenceCompletion", prompt: "Fill the gap.", sortOrder: 20 },
            { id: "tfng-id", type: "TrueFalseNotGiven", prompt: "Read this statement.", sortOrder: 10 },
        ],
    });

    assert.equal(start.attempt.id, "attempt-id");
    assert.equal(start.attempt.endsAt, "2026-11-22T12:20:00Z");
    assert.deepEqual(start.passage.paragraphs.map(({ text }) => text), ["The first paragraph.", "The second paragraph."]);
    assert.deepEqual(start.passage.questions.map(({ id, type, number }) => [id, type, number]), [
        ["tfng-id", "tfng", 1], ["completion-id", "completion", 2],
    ]);
    assert.deepEqual(start.savedAnswers, { "tfng-id": "NOT GIVEN" });
});

test("displays the server score and band and counts only answered questions", () => {
    const result = toResult({
        attemptId: "attempt-id", passageId: "passage-id", passageTitle: "Urban gardens",
        rawScore: 1, totalQuestions: 3, approxBand: null,
        questions: [
            { type: "TrueFalseNotGiven", selectedAnswer: "Not Given", isCorrect: true },
            { type: "TrueFalseNotGiven", selectedAnswer: null, isCorrect: false },
            { type: "SentenceCompletion", selectedAnswer: "plants", isCorrect: false },
        ],
    });

    assert.equal(result.correct, 1);
    assert.equal(result.total, 3);
    assert.equal(result.answered, 2);
    assert.equal(result.band, null);
    assert.deepEqual(result.breakdown, [
        { label: "True, False or Not Given", correct: 1, total: 2 },
        { label: "Sentence completion", correct: 0, total: 1 },
    ]);
});

test("accepts only a loopback API origin for the local submit rewrite", () => {
    assert.equal(getLoopbackApiUrl("http://localhost:8080").origin, "http://localhost:8080");
    for (const value of ["https://api.example.test", "ftp://localhost/", "http://localhost:8080/api", "http://localhost@other.example"]) {
        assert.equal(getLoopbackApiUrl(value), null);
    }
});
