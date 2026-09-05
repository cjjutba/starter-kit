import { HONEYPOT_FIELD } from "@/lib/guard/honeypot";

// A field people never see and bots fill in. Off screen rather than
// display none, because some bots skip hidden inputs.

export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
      <label htmlFor={HONEYPOT_FIELD}>Leave this empty</label>
      <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
  );
}
