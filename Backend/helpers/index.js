const handleError500 = (res, error) => {
  return res.status(500).json({
    message: "Lỗi sever",
    error: error.message || "Lỗi",
  });
};

export { handleError500 };
