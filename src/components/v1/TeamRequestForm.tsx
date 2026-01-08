// src/components/v1/TeamRequestForm.tsx

// Define the shape of the props
interface TeamRequestFormProps {
  isMember: boolean;
}

export default function TeamRequestForm({ isMember }: TeamRequestFormProps) {
  // Now you can use isMember inside your component logic
  return (
    <form>
      {/* Your form fields */}
      <button
        disabled={!isMember}
        type="submit"
        className={!isMember ? "opacity-50 cursor-not-allowed" : ""}
      >
        Submit Request
      </button>
    </form>
  );
}