import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ApiError } from "../../../core/http/api-error";
import { Button } from "../../../shared/components/ui/button";
import { Card } from "../../../shared/components/ui/card";
import { useRegisterFile } from "../hooks/use-register-file";
import type { FileDirection } from "../types/file-registry.types";

function formatFileSize(size: number) {
  if (size < 1_024) {
    return `${size} bytes`;
  }

  if (size < 1_024 * 1_024) {
    return `${(size / 1_024).toFixed(1)} KB`;
  }

  return `${(size / (1_024 * 1_024)).toFixed(1)} MB`;
}

function uploadErrorMessage(error: ApiError) {
  if (error.status === 403) {
    return "You do not have permission to register files.";
  }

  if (error.status === 409) {
    return "The file could not be registered because of an operation conflict.";
  }

  return error.message;
}

export function RegisterFileForm() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [direction, setDirection] = useState<FileDirection>("INBOUND");
  const [file, setFile] = useState<File | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null,
  );
  const registration = useRegisterFile();

  const resetForm = () => {
    setDirection("INBOUND");
    setFile(null);
    setValidationMessage(null);
    registration.reset();

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setValidationMessage("Select a file to register.");
      return;
    }

    if (file.size === 0) {
      setValidationMessage("The selected file must not be empty.");
      return;
    }

    setValidationMessage(null);
    registration.mutate(
      { direction, file },
      {
        onSuccess: (response) => {
          resetForm();
          navigate(`/file-registry/${response.fileId}`, {
            state: { registrationMessage: response.message },
          });
        },
      },
    );
  };

  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">
          Register file manually
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Upload an inbound or outbound file to the VOR registry.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-slate-300"
              htmlFor="register-file-direction"
            >
              Direction
            </label>
            <select
              id="register-file-direction"
              className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none focus:border-indigo-500"
              value={direction}
              onChange={(event) =>
                setDirection(event.target.value as FileDirection)
              }
              disabled={registration.isPending}
            >
              <option value="INBOUND">INBOUND</option>
              <option value="OUTBOUND">OUTBOUND</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-slate-300"
              htmlFor="register-file-input"
            >
              File
            </label>
            <input
              ref={inputRef}
              id="register-file-input"
              className="block min-h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
              type="file"
              onChange={(event) => {
                setFile(event.target.files?.[0] ?? null);
                setValidationMessage(null);
                registration.reset();
              }}
              disabled={registration.isPending}
            />
          </div>
        </div>

        {file ? (
          <p className="mt-3 text-sm text-slate-400">
            Selected: <span className="text-slate-200">{file.name}</span> (
            {formatFileSize(file.size)})
          </p>
        ) : null}

        {validationMessage ? (
          <p className="mt-4 text-sm text-rose-300" role="alert">
            {validationMessage}
          </p>
        ) : null}

        {registration.error ? (
          <p
            className="mt-4 text-sm text-rose-300"
            role="alert"
            aria-live="assertive"
          >
            {uploadErrorMessage(registration.error)}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            type="submit"
            disabled={registration.isPending || !file}
          >
            {registration.isPending ? "Registering..." : "Register file"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={resetForm}
            disabled={registration.isPending}
          >
            Cancel / reset
          </Button>
        </div>
      </form>
    </Card>
  );
}
