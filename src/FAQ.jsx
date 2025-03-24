import React, { useState } from 'react';
import "./FAQ.css";

function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqData = [
        { question: "Where can I find my liked posts?", answer: "You can find them on the Community page! Just click the menu in the bottom right, and go to 'Likes' next to the heart icon." },
        { question: "How do I make a skill post?", answer: "Go to the Marketplace page and click on 'Post My Skill' to create a skill post." },
        { question: "How can I interact with community posts?", answer: "You can like, comment, or share posts by clicking on the respective buttons." },
    ];

    return (
        <div className='faqs'>
            <section className='faqSection'>
                <div className='faqTitle'>
                    <h1>Frequently Asked Questions</h1>
                </div>
                {faqData.map((item, index) => (
                    <div className='faqItem' key={index}>
                        <button className='faqQuestion' onClick={() => toggleFAQ(index)}>
                            {item.question}
                            <span className='faqIcon'>{openIndex === index ? "-" : "+"}</span>
                        </button>
                        {openIndex === index && (
                            <div className='faqAnswer'>
                                <p>{item.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </section>
        </div>
    );
}

export default FAQ;
