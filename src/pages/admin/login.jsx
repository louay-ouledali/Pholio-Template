import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import NavBar from "../../components/common/navBar";
import Footer from "../../components/common/footer";
import "./styles/login.css";

const AdminLogin = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		setError(""); // Clear previous errors
		try {
			await signInWithEmailAndPassword(auth, email, password);
			navigate("/admin/dashboard");
		} catch (err) {
			console.error("Login Error:", err);
			// Show the specific error message from Firebase
			setError(`Login failed: ${err.message}`);
		}
	};

	return (
		<div className="page-content">
			<NavBar active="admin" />
			<div className="content-wrapper">
				<div className="login-container">
					<h2>Admin Login</h2>
					{error && <p className="error-message">{error}</p>}
					<form onSubmit={handleLogin} className="login-form">
						<div className="form-group">
							<label>Email</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="form-group">
							<label>Password</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<button type="submit" className="login-btn">Login</button>
					</form>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default AdminLogin;
