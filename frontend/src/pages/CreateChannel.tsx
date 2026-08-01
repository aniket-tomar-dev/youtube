import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const CreateChannel = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/channels", { name, description });

      const token = localStorage.getItem("token") as string;
      login(token, { ...user!, channel: res.data.channel });

      navigate(`/channel/${res.data.channel.id}`);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "The channel could not be created.",
      );
    }
  };

  return (
    <div className="form-container">
      <h2>Create your Channel</h2>
      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Channel Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="About your Channel  (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <button type="submit"> Create Channel </button>
      </form>
    </div>
  );
};

export default CreateChannel;
