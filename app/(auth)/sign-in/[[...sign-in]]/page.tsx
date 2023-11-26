"use client";
import React from "react";
import web3 from "../../../services/web3";
const SignIn: React.FC = () => {
  const handleLogin = async () => {
    try {
      if (web3) {
        await web3.eth.requestAccounts();
        const accounts = await web3.eth.getAccounts();
        console.log("Connected Account:", accounts[0]);
      } else {
        console.error("Web3 is not initialized");
      }
    } catch (error: any) {
      console.error("Error while logging in:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-md shadow-md">
        <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>

        <form>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full border rounded-md py-2 px-3"
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full border rounded-md py-2 px-3"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="button"
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
