import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import MathProblemDisplay from './components/MathProblem';
import AppPage from './pages/AppPage';

interface MathProblem {
  code: string;
  problem: string;
  highlights: string[];
  answers?: string[];
}

const mathProblems: MathProblem[] = [
  // {
  //   code: "C0711920ZZZ15XABG_2",
  //   problem: "다음 그림은 반비례 그래프 $y=\\frac{a}{x}$의 그래프의 일부이고 점 P는 이 그래프 위의 점이다. 점 P에서 $x$축에 그은 수선이 $x$축과 만나는 점 $A$에 대하여 삼각형 POA의 넓이가 16일 때, 상수 $a$의 값을 구하시오. (단, $O$는 원점이다.)",
  //   highlights: [" $y=\\frac{a}{x}$", "그래프 위의 점이다", "삼각형 POA의 넓이가 16"]
  // },
  // {
  //   code: "C0711920ZZZ15XABG_3",
  //   problem: "반비례 관계 $y=\\frac{8}{x}$의 그래프가 두 점 $(2,a)$,$(b,\\frac{1}{2})$을 지날 때, $a+b$의 값을 구하시오.",
  //   highlights: []
  // },
  {
    code: "C0711920ZZZ15XABG_4",
    problem: "크기가 다른 두 톱니바퀴가 서로 맞물려 회전하고 있다. 톱니가 24 개인 큰 톱니바퀴가 3번 회전할 때, 톱니가 $x$ 개인 작은 톱니바퀴는 $y$번 회전한다. 이때, $y$를 $x$에 대한 식으로 나타내면?",
    highlights: ["톱니가 24 개인 큰 톱니바퀴가 3번 회전할 때", "톱니가 $x$ 개인 작은 톱니바퀴는 $y$번 회전한다"],
    answers: [
      " $y = \\frac{24}{x}$",
      " $y = \\frac{48}{x}$",
      " $y = \\frac{72}{x}$",
      " $y = 24x$",
      " $y = 72x$"
    ]
  },
  // {
  //   code: "C0711920ZZZ15XABG_5",
  //   problem: "반비례 관계 $y=-\\frac{12}{x}$의 그래프 위의 점 $(m,n)$ 중에서 $m,n$이 모두 정수인 점의 개수는?",
  //   highlights: [],
  //   answers: [
  //     " 6",
  //     " 8",
  //     " 10",
  //     " 12",
  //     " 14"
  //   ]
  // }
];

// Math Problems Home Component
const MathProblemsHome: React.FC = () => {
  return (
    <div className="min-h-screen p-8 pb-20 bg-gray-100 text-black" style={{ backgroundColor: 'beige' }}>
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Math Problems</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          {mathProblems.map((problem, index) => (
            <div key={index} className="w-[400px] mx-auto text-left mb-32 last:mb-0">
              <div className="text-sm text-gray-500 mb-2">관리 코드: {problem.code}</div>
              <MathProblemDisplay
                problem={problem.problem}
                highlights={problem.highlights}
                answers={problem.answers}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <Router basename="/webviewTest">
        <Routes>
          <Route path="/" element={<MathProblemsHome />} />
          <Route path="/app" element={<AppPage />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
