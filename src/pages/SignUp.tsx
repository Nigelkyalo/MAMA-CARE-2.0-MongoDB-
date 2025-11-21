import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { AlertCircle, Baby, LockKeyhole, Mail, UserRoundPlus } from "lucide-react";

const SignUp = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signUp({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      navigate("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to create your account. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/10 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-2xl shadow-xl border-primary/10">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Baby className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold">Create your MamaCare account</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Personalized support, reminders, and resources tailored to your pregnancy journey.
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 flex items-center space-x-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          <form className="grid gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <UserRoundPlus className="h-4 w-4 text-primary" />
                First name
              </Label>
              <Input
                id="firstName"
                placeholder="Sarah"
                value={form.firstName}
                onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="flex items-center gap-2">
                <UserRoundPlus className="h-4 w-4 text-primary" />
                Last name
              </Label>
              <Input
                id="lastName"
                placeholder="Kamau"
                value={form.lastName}
                onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <LockKeyhole className="h-4 w-4 text-primary" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                <LockKeyhole className="h-4 w-4 text-primary" />
                Confirm password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create account"}
              </Button>
            </div>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in instead
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;

