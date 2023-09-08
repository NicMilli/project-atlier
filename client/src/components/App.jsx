import {
  BrowserRouter as Router, Routes, Route, Navigate,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import ProductDetails from './ProductDetails/ProductDetails';
import ReviewsAndRatings from './ReviewsRatings/ReviewsAndRatings';
import QuestionsAnswers from './QuestionsAnswers/QuestionsAnswers';
import RelatedItems from './RelatedItems/RelatedItems';
import Navbar from './SharedComponents/Navbar';
import SiteAnnouncement from './SharedComponents/SiteAnnouncement';
import 'react-toastify/dist/ReactToastify.css';
import '../styles.css';

function App() {
  const { dark } = useSelector((state) => state.products);
  const rnrRef = React.useRef(null);
  const qnaRef = React.useRef(null);
  const relatedRef = React.useRef(null);
  const handleScroll = (element) => {
    if (element === 'related') {
      relatedRef.current.scrollIntoView();
    } else if (element === 'qna') {
      qnaRef.current.scrollIntoView();
    } else if (element === 'rnr') {
      rnrRef.current.scrollIntoView();
    }
  };

  return (
    <div>
      <ToastContainer />
      <Router>
        <Navbar handleScroll={handleScroll} />
        <div className={dark ? 'theme-dark' : null}>
          <SiteAnnouncement />
          <div className="body-no-navbar">
            <Routes>
              <Route path="/" element={<Navigate to="/1" />} />
              <Route path="/NotFound" element={<div>404 not found...</div>} />
              <Route
                path="/:productId"
                element={(
                  <>
                    <ProductDetails handleScroll={handleScroll} />
                    <div ref={relatedRef}>
                      <RelatedItems />
                    </div>
                    <div ref={qnaRef}>
                      <QuestionsAnswers />
                    </div>
                    <div ref={rnrRef}>
                      <ReviewsAndRatings />
                    </div>
                  </>
              )}
              />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
