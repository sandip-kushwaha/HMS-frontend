import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle,
  LoaderCircle,
  MapPin,
  Users,
  Utensils,
  AlertCircle,
} from "lucide-react";


import { createSession } from "../../api/session.api";
import { useSession } from "../../context/SessionContext";

const TableEntry = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();

  const { saveSession } = useSession();

  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [tableId]);

  const handleStartSession = async (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      setError("Please enter your name.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await createSession({
        tableId,
        customerName: customerName.trim(),
      });

      console.log("Session response:", response);

      const sessionData = response?.data;

      if (!sessionData?.sessionToken) {
        throw new Error("Session token was not returned by the server.");
      }

      // expected by SessionContext
      saveSession({
        sessionToken: sessionData.sessionToken,
        customerName: sessionData.session?.customerName || "",
        table: sessionData.session?.table || null,
      });

      navigate("/menu");
    } catch (error) {
      console.error("Create customer session error:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to start your table session.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 ">

      <main className="flex min-h-[75vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm ">
            {/* Icon */}
            <div className="mx-auto flex h-15 w-15 items-center justify-center rounded-2xl bg-blue-100 ">
              <Utensils size={30} className="text-blue-500" />
            </div>

            <div className="mt-2 text-center">
              <h1 className="text-2xl font-extrabold sm:text-3xl">
                Welcome to HotelEase
              </h1>

              <p className="mt-1 text-sm text-gray-500 ">
                Enter your name to start ordering from your table.
              </p>
            </div>

            {/* Table Information */}
            <div className="mt-4 grid grid-cols-1 gap-3">
              <div className="rounded-xl bg-gray-50 p-4 ">
                <div className="flex items-center gap-2 text-blue-500">
                  <MapPin size={17} />
                  <span className=" text-xs font-semibold">Table</span>
                </div>

                <p className="mt-2 text-sm font-bold ">#{tableId}</p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 ">
                <AlertCircle size={19} className="mt-0.5 shrink-0" />

                <p>{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleStartSession} className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="customerName"
                  className="mb-1 block text-sm font-semibold"
                >
                  Your Name
                </label>

                <input
                  id="customerName"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={100}
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 "
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3.5 font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoaderCircle size={19} className="animate-spin" />
                    Starting Session...
                  </>
                ) : (
                  <>
                    <CheckCircle size={19} />
                    Start Ordering
                  </>
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-xs leading-5 text-gray-500">
              Your session is linked to this table and will be used for your
              food orders.
            </p>
          </div>
        </div>
      </main>

    </div>
  );
};

export default TableEntry;
