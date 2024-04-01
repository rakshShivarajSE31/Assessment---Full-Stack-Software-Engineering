// import React from 'react';
// import { Link } from 'react-router-dom';
// import logo from '../assets/intelLogo.png';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import './Footer.css';

// function Footer() {
//   return (
//     <footer className="footer">
//       <div className="container">
//         <div className="row">
//           <div className="col-md-4">
//             <img src={logo} alt="Intel Logo" height="60" />
//           </div>
//           <div className="col-md-4 text-center">
//             <Link to="https://www.intc.com/news-events" target="_blank" className="news-link">
//               <i className="bi bi-newspaper"></i>
//               <span>News & Updates</span>
//             </Link>
//           </div>
//           <div className="col-md-4 text-end">
//             <a href="https://www.linkedin.com/company/intel-corporation/" target="_blank" className="social-link">
//               <i className="bi bi-linkedin"></i>
//             </a>
//             <a href="https://twitter.com/intel" target="_blank" className="social-link" style={{ marginLeft: '20px' }}>
//               <i className="bi bi-twitter"></i>
//             </a>
//           </div>
//         </div>
//       </div>
//       <div className="footer-bottom">
//         <div className="container">
//           <p className="text-center">
//             Market Data copyright © 2024 QuoteMedia. Data delayed 15 minutes unless otherwise indicated (view delay times for all exchanges). RT=Real-Time, EOD=End of Day, PD=Previous Day. Market Data powered by QuoteMedia. Terms of Use.
//           </p>
//         </div>
//       </div>
//     </footer> 
//   );
// }

// export default Footer;



import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/intelLogo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <img src={logo} alt="Intel Logo" height="60" />
          </div>
          <div className="col-md-4 text-center">
            <Link to="https://www.intc.com/news-events" target="_blank" className="news-link">
              <i className="bi bi-newspaper"></i>
              <span>News & Updates</span>
            </Link>
          </div>
          <div className="col-md-4 text-end">
            <a href="https://www.linkedin.com/company/intel-corporation/" target="_blank" className="social-link">
              <i className="bi bi-linkedin"></i>
            </a>
            <a href="https://twitter.com/intel" target="_blank" className="social-link" style={{ marginLeft: '20px' }}>
              <i className="bi bi-twitter"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p className="text-center">
            Market Data copyright © 2024 QuoteMedia. Data delayed 15 minutes unless otherwise indicated (view delay times for all exchanges). RT=Real-Time, EOD=End of Day, PD=Previous Day. Market Data powered by QuoteMedia. Terms of Use.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;