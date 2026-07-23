// Hidden from real visitors (off-screen, not display:none -- some bots skip
// display:none fields), but a naive bot filling every input will fill this
// one in. If it has a value on submit, treat the submission as spam.
function HoneypotField({ value, onChange }) {
  return (
    <div
      aria-hidden="true"
      className="absolute -left-[9999px] -top-[9999px] h-0 w-0 overflow-hidden"
    >
      <label htmlFor="kk-hp-company">Company</label>
      <input
        id="kk-hp-company"
        name="company"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default HoneypotField;
