import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
          <ApperIcon name="AlertCircle" size={48} className="text-indigo-600" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-bold text-slate-900">
            404 - Page Not Found
          </h1>
          <p className="text-lg text-slate-600">
            Oops! The page you're looking for doesn't exist.
          </p>
        </div>

        <div className="pt-4">
          <Button
            onClick={handleGoHome}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="Home" size={20} />
            <span>Back to Home</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;