"use client";
import { useState } from "react";
import { Plus, Minus, Sparkles } from "lucide-react";

const questions = [
  {
    no: "01",
    tag: "First Sabbath Welcome",
    question: "Is this my first Sabbath welcome?",
    answer:
      "Absolutely. You do not need to be a member or know the order of service in advance. Every visitor is welcomed with warmth, grace, and room to meet the community at their own pace.",
  },
  {
    no: "02",
    tag: "Sabbath Hours",
    question: "When are Sabbath School and Divine Service?",
    answer:
      "Sabbath School begins at 8:00 AM on Saturday for interactive study of the Scriptures, followed by Divine Service at 9:00 AM. Please confirm current times with the ministry before travelling.",
  },
  {
    no: "03",
    tag: "Children & Family",
    question: "Can I bring my family and children?",
    answer:
      "Yes. Children, youth, and families are welcome to gather, learn the Word, and worship together across our generational fellowships.",
  },
  {
    no: "04",
    tag: "What to Bring",
    question: "Do I need to bring anything with me?",
    answer:
      "You are welcome to bring a Bible and a notebook for Sabbath School and expository teaching, and your honest questions are always welcome.",
  },
];

export default function VisitorFAQ() {
  const [openIndices, setOpenIndices] = useState([0]);

  const toggleIndex = (idx) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((item) => item !== idx) : [...prev, idx],
    );
  };

  const allOpen = openIndices.length === questions.length;
  const toggleAll = () => {
    setOpenIndices(allOpen ? [] : questions.map((_, i) => i));
  };

  return (
    <div className="visit-faq" id="faq">
      <div className="visit-faq-intro">
        <span className="folio-tag">
          <Sparkles size={12} aria-hidden="true" /> Questions &amp; Answers
        </span>
        <span className="eyebrow" style={{ marginTop: 14 }}>
          Good to know
        </span>
        <h3 className="display">
          Before you <em>gather.</em>
        </h3>
        <p className="visit-faq-sub">
          Helpful answers for your first Saturday with Yashua Resurrection
          Power Ministry. Click any question to open its answer.
        </p>
        <button
          type="button"
          className="faq-expand-all-btn"
          onClick={toggleAll}
          aria-pressed={allOpen}
        >
          {allOpen ? (
            <>
              <Minus size={14} aria-hidden="true" /> Collapse all answers
            </>
          ) : (
            <>
              <Plus size={14} aria-hidden="true" /> Expand all ({questions.length})
            </>
          )}
        </button>
      </div>

      <div className="visit-faq-list" role="list">
        {questions.map((item, i) => {
          const isOpen = openIndices.includes(i);
          return (
            <div
              role="listitem"
              className={`visit-faq-item arch-faq-card ${isOpen ? "is-open" : ""}`}
              key={item.question}
            >
              <h4>
                <button
                  id={`faq-question-${i}`}
                  type="button"
                  className="visit-faq-trigger"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  onClick={() => toggleIndex(i)}
                >
                  <span className="faq-q-index">{item.no}</span>
                  <span className="faq-q-copy">
                    <small className="faq-q-tag">{item.tag}</small>
                    <strong>{item.question}</strong>
                  </span>
                  <span className="faq-q-icon" aria-hidden="true">
                    <Plus size={18} />
                  </span>
                </button>
              </h4>
              <div
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-question-${i}`}
                aria-hidden={!isOpen}
                className="visit-faq-answer"
              >
                <div className="visit-faq-answer-inner">
                  <p>{item.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
