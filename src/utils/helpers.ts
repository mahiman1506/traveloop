// API Helper functions
export const apiCall = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

export const api = {
  get: (url: string) => apiCall(url, { method: "GET" }),
  post: (url: string, data: any) =>
    apiCall(url, { method: "POST", body: JSON.stringify(data) }),
  put: (url: string, data: any) =>
    apiCall(url, { method: "PUT", body: JSON.stringify(data) }),
  delete: (url: string) => apiCall(url, { method: "DELETE" }),
};

// Trip utilities
export const getTripDuration = (startDate: Date, endDate: Date): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const formatDateRange = (startDate: Date, endDate: Date): string => {
  const start = new Date(startDate).toLocaleDateString();
  const end = new Date(endDate).toLocaleDateString();
  return `${start} - ${end}`;
};

// Budget utilities
export const calculateTotalBudget = (budget: any): number => {
  return (
    budget.transportCost +
    budget.hotelCost +
    budget.activityCost +
    budget.mealCost +
    (budget.miscCost || 0)
  );
};

export const calculateBudgetPerDay = (budget: any, days: number): number => {
  return calculateTotalBudget(budget) / days;
};

export const generateShareUrl = (tripId: string): string => {
  return `${process.env.NEXT_PUBLIC_APP_URL}/trip/${tripId}`;
};

// Image utilities
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "",
  );

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

// Date utilities
export const isDateInPast = (date: Date): boolean => {
  return new Date(date) < new Date();
};

export const getDaysBetween = (startDate: Date, endDate: Date): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
