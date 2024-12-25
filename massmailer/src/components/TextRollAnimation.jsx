import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Typography } from "@mui/material";

const TextRollAnimation = () => {
  const texts = [
    "Welcome to MassMailer",
    "Simplify Your Bulk Emails",
    "Effortless Email Campaigns Await",
  ];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 4000); // Change text every 5 seconds

    return () => clearInterval(interval);
  }, [texts.length]);

  const animationVariants = {
    hidden: { y: "100%", opacity: 0, filter: "blur(10px)" },
    visible: { y: 0, opacity: 1, filter: "blur(0px)" },
    exit: { y: "-100%", opacity: 0, filter: "blur(10px)" },
  };

  return (
    <div style={{ position: "relative", height: "50px", overflow: "hidden" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTextIndex}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={animationVariants}
          transition={{ duration: 1 }}
        >
          <Typography variant="h6" sx={{ color: "purple" }}>
            {texts[currentTextIndex]}
          </Typography>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TextRollAnimation;
