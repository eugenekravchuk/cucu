const Calendar = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
        fontSize: "20px",
        width: "100%",
      }}>
      <div className="font-bold mb-7">Coming Soon...</div>
      <img
        src="/assets/images/keanu.webp"
        className="w-[300px] h-[170px] rounded"
        alt=""
      />
    </div>
  );
};

export default Calendar;
