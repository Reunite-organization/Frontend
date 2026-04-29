import { useEffect, useState } from "react";
import { ImagePlus, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialErrors = {};

function buildInitialForm(defaultLocation) {
  return {
    name: "",
    description: "",
    lat: defaultLocation?.lat?.toString() || "",
    lng: defaultLocation?.lng?.toString() || "",
    image: null,
  };
}

function validateForm(form) {
  const errors = {};
  const lat = Number(form.lat);
  const lng = Number(form.lng);

  if (!form.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!form.description.trim()) {
    errors.description = "Description is required.";
  }

  if (!form.lat.trim()) {
    errors.lat = "Latitude is required.";
  } else if (Number.isNaN(lat) || lat < -90 || lat > 90) {
    errors.lat = "Latitude must be between -90 and 90.";
  }

  if (!form.lng.trim()) {
    errors.lng = "Longitude is required.";
  } else if (Number.isNaN(lng) || lng < -180 || lng > 180) {
    errors.lng = "Longitude must be between -180 and 180.";
  }

  if (form.image && !form.image.type.startsWith("image/")) {
    errors.image = "Selected file must be an image.";
  }

  return errors;
}

export default function ReportSightingModal({
  isOpen,
  onClose,
  onSubmit,
  defaultLocation,
}) {
  const [form, setForm] = useState(buildInitialForm(defaultLocation));
  const [errors, setErrors] = useState(initialErrors);

  useEffect(() => {
    if (!isOpen) return;

    setForm(buildInitialForm(defaultLocation));
    setErrors(initialErrors);
  }, [defaultLocation, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (field) => (event) => {
    const value = event.target.files ? event.target.files[0] || null : event.target.value;

    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateForm(form);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      location: {
        lat: Number(form.lat),
        lng: Number(form.lng),
      },
      image: form.image,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-charcoal/45 px-4 py-6 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-[30px] border border-[#eadfce] bg-[#fdfbf7] shadow-[0_28px_80px_rgba(44,40,37,0.22)]">
        <div className="border-b border-[#efe3d6] bg-[linear-gradient(135deg,rgba(212,165,74,0.14),rgba(91,140,111,0.10))] px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-600">
                <MapPin className="h-3.5 w-3.5 text-terracotta" />
                Report Sighting
              </span>
              <div>
                <h2 className="text-2xl font-display text-charcoal">
                  Share a new sighting
                </h2>
                <p className="mt-1 text-sm leading-6 text-stone-600">
                  Add details and coordinates so the team can review the lead quickly.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-stone-500 transition hover:text-charcoal"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-semibold text-charcoal">
                Name
              </label>
              <Input
                value={form.name}
                onChange={handleChange("name")}
                placeholder="Witness or subject name"
                className="h-11 rounded-2xl border-[#ded5c9] bg-white"
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name ? (
                <p className="text-sm text-red-600">{errors.name}</p>
              ) : null}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-semibold text-charcoal">
                Description
              </label>
              <Textarea
                value={form.description}
                onChange={handleChange("description")}
                placeholder="Describe what was seen, when, and any notable details."
                className="min-h-28 rounded-2xl border-[#ded5c9] bg-white"
                aria-invalid={Boolean(errors.description)}
              />
              {errors.description ? (
                <p className="text-sm text-red-600">{errors.description}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-charcoal">
                Latitude
              </label>
              <Input
                value={form.lat}
                onChange={handleChange("lat")}
                inputMode="decimal"
                placeholder="9.03"
                className="h-11 rounded-2xl border-[#ded5c9] bg-white"
                aria-invalid={Boolean(errors.lat)}
              />
              {errors.lat ? (
                <p className="text-sm text-red-600">{errors.lat}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-charcoal">
                Longitude
              </label>
              <Input
                value={form.lng}
                onChange={handleChange("lng")}
                inputMode="decimal"
                placeholder="38.74"
                className="h-11 rounded-2xl border-[#ded5c9] bg-white"
                aria-invalid={Boolean(errors.lng)}
              />
              {errors.lng ? (
                <p className="text-sm text-red-600">{errors.lng}</p>
              ) : null}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-semibold text-charcoal">
                Optional image
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-[#d9cec0] bg-[#fcfaf6] px-4 py-3 transition hover:border-[#cdbca7]">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-terracotta shadow-sm">
                    <ImagePlus className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">
                      {form.image ? form.image.name : "Upload supporting image"}
                    </p>
                    <p className="text-xs text-stone-500">
                      JPG, PNG, or WEBP
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-[#d8cbbb] bg-white px-3 py-1 text-xs font-semibold text-stone-600">
                  Browse
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChange("image")}
                  className="hidden"
                />
              </label>
              {errors.image ? (
                <p className="text-sm text-red-600">{errors.image}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#efe3d6] pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-11 rounded-full border-[#d9cec0] bg-white px-5 text-charcoal"
            >
              Cancel
            </Button>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-full bg-terracotta px-5 text-sm font-semibold text-white transition hover:bg-clay"
            >
              Submit Sighting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
