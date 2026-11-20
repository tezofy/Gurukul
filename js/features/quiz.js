/* ==========================================================================
   ২০. কুইজ ইঞ্জিন
   ফাইল: js/features/quiz.js
   ========================================================================== */
  function startQuiz() {
      U.quiz = { i: 0, answers: {}, left: DB.quizzes.weekly.minutes * 60 };
      U.result = null;
      location.hash = '#/quiz';
      render();
    }
  function startQuizTimer() {
      clearInterval(U.quizTimer);
      U.quizTimer = setInterval(() => {
        if (!U.quiz) return clearInterval(U.quizTimer);
        U.quiz.left--;
        const el = document.getElementById('quizTimer');
        if (el) el.textContent = `${bn(String(Math.floor(U.quiz.left / 60)).padStart(2, '0'))}:${bn(String(U.quiz.left % 60).padStart(2, '0'))}`;
        if (U.quiz.left <= 0) { clearInterval(U.quizTimer); submitQuiz(); }
      }, 1000);
    }
  function submitQuiz() {
      const q = U.quiz; if (!q) return;
      const Qs = DB.quizzes.weekly.questions;
      let correct = 0;
      Qs.forEach((qq, i) => { if (q.answers[i] === qq.ans) correct++; });
      const score = Math.round(correct / Qs.length * 100);
      const when = `${bn(new Date().getDate())} ${BN_MONTH[new Date().getMonth()].slice(0, 4)}`;
      S.attempts.push({ title: DB.quizzes.weekly.title, score, correct, total: Qs.length, when });
      save('attempts');
      bumpActivity(12);
      U.result = { score, correct, answers: { ...q.answers } };
      U.quiz = null;
      clearInterval(U.quizTimer);
      chime(score >= 50 ? 'complete' : 'tick');
      location.hash = '#/result';
      render();
      setTimeout(() => burst(window.innerWidth / 2, 220, score >= 50 ? 22 : 10), 200);
    }
