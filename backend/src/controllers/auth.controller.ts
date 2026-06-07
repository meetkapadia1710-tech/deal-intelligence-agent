import { Request, Response } from "express";

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ success: false, message: "Email and password required" });
    return;
  }
  
  // Hardcoded demo credentials
  if (email === "alex.chen@example.com" && password === "password") {
    res.json({ success: true, token: "demo-token-123", user: { name: "Alex Chen", email } });
  } else {
    res.status(401).json({ success: false, message: "Invalid email or password" });
  }
}
