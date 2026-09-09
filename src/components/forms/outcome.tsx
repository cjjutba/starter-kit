// The line under a form after it returns. An error is red, a message is
// quiet, nothing is nothing. Every form with a state object uses this.

export interface FormState {
  ok?: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string | undefined>;
}

export function Outcome({ state }: { state: FormState }) {
  if (state.error) {
    return (
      <p role="alert" className="text-small text-error">
        {state.error}
      </p>
    );
  }
  if (state.ok && state.message) {
    return (
      <p role="status" className="text-small text-text-2">
        {state.message}
      </p>
    );
  }
  return null;
}
