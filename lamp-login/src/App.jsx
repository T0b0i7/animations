import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import './index.css';

export default function App() {
  const [isOn, setIsOn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleDragEnd = (event, info) => {
    // If pulled down far enough, toggle the lamp
    if (info.offset.y > 30) {
      setIsOn(prev => !prev);
    }
  };

  const d = useTransform([x, y], ([latestX, latestY]) => {
    return `M 0 0 L ${latestX} ${80 + latestY}`;
  });

  return (
    <div className={`room ${isOn ? 'on' : 'off'}`}>
      <div className="hint-text">Pull the string to toggle login</div>

      <div className="lamp-container">
        <div className="lamp-glow"></div>
        <div className="lamp-head"></div>
        <div className="light-beam"></div>
        <div className="lamp-stem"></div>
        <div className="lamp-base"></div>
        <div className="desk-surface"></div>

        {/* Dynamic SVG for the realistic string line */}
        <svg style={{ position: 'absolute', top: 12, left: '50%', marginLeft: 55, width: 2, height: 2, overflow: 'visible', zIndex: 5, pointerEvents: 'none' }}>
          <motion.path
            d={d}
            stroke="#222"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Draggable Handle */}
        <motion.div
          className="string-handle"
          style={{
            position: 'absolute',
            top: 92, // 12 + 80
            left: '50%',
            marginLeft: 49, // 55 minus half handle width (12/2 = 6)
            x,
            y,
            cursor: 'grab',
            zIndex: 6,
          }}
          drag
          dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
          dragElastic={{ top: 0, bottom: 0.6, left: 0.3, right: 0.3 }}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 4 }}
          onDragEnd={handleDragEnd}
          whileTap={{ cursor: "grabbing" }}
        />
      </div>

      {/* Login Form that appears when the light is ON */}
      {isOn && (
        <motion.div
          className="login-form-container"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <h2 className="login-title">Welcome Back</h2>
          <div className="login-input-group">
            <input type="email" placeholder="Email address" className="login-input" />

            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="login-input"
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="login-input"
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="forgot-password">
              <a href="#">Forgot Password?</a>
            </div>
          </div>

          <button className="login-button">Sign In</button>

          <div className="divider">
            <span>or</span>
          </div>

          <button className="google-button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </motion.div>
      )}
    </div>
  );
}
