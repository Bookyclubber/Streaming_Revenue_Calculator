import React, { useState } from "react";

const MASTER_REVENUE_PER_STREAM = 0.004;
const PUBLISHING_REVENUE_PER_STREAM = 0.00055;

const INFLATION_RATE = 0.03; // 3% annual inflation

const Calculator = () => {
  const [songCount, setSongCount] = useState(1);
  const [streams, setStreams] = useState(Array(10).fill(""));
  const [releaseDate, setReleaseDate] = useState("");
  const [targetRevenue, setTargetRevenue] = useState("");
  const [masterOwnershipSplit, setMasterOwnershipSplit] = useState(100);
  const [publishingOwnershipSplit, setPublishingOwnershipSplit] = useState(100);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleStreamChange = (index, value) => {
    const newStreams = [...streams];
    newStreams[index] = value.replace(/,/g, ""); // Remove commas
    setStreams(newStreams);
  };

  const calculateRevenue = () => {
    const totalStreams = streams
      .slice(0, songCount)
      .reduce((sum, stream) => sum + (Number(stream) || 0), 0);
    const masterRevenue = totalStreams * MASTER_REVENUE_PER_STREAM;
    const publishingRevenue = totalStreams * PUBLISHING_REVENUE_PER_STREAM;
    const totalRevenue = masterRevenue + publishingRevenue;

    const userMasterShare = masterRevenue * (masterOwnershipSplit / 100);
    const userPublishingShare =
      publishingRevenue * (publishingOwnershipSplit / 100);
    const totalUserShare = userMasterShare + userPublishingShare;

    const releaseDateObj = new Date(releaseDate);
    const currentDate = new Date();
    const timeDifference = currentDate - releaseDateObj;
    const daysSinceRelease = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (isNaN(daysSinceRelease) || daysSinceRelease < 0) {
      setError("Please enter a valid release date in the past.");
      return;
    } else {
      setError("");
    }

    const dailyTotalRevenue = totalRevenue / Math.max(daysSinceRelease, 1);
    const dailyUserShare = totalUserShare / Math.max(daysSinceRelease, 1);

    const revenueDelta = Math.max(0, targetRevenue - totalRevenue);
    const userShareDelta = Math.max(0, targetRevenue - totalUserShare);

    const daysToTargetRevenue =
      revenueDelta > 0 ? Math.ceil(revenueDelta / dailyTotalRevenue) : 0;
    const daysToTargetUserShare =
      userShareDelta > 0 ? Math.ceil(userShareDelta / dailyUserShare) : 0;

    const totalDaysToReachTargetRevenue =
      daysSinceRelease + daysToTargetRevenue;
    const totalDaysToReachTargetUserShare =
      daysSinceRelease + daysToTargetUserShare;

    const monthsToTargetRevenue = Math.ceil(totalDaysToReachTargetRevenue / 30);
    const quartersToTargetRevenue = Math.ceil(
      totalDaysToReachTargetRevenue / 91
    );
    const yearsToTargetRevenue = Math.ceil(totalDaysToReachTargetRevenue / 365);

    const monthsToTargetUserShare = Math.ceil(
      totalDaysToReachTargetUserShare / 30
    );
    const quartersToTargetUserShare = Math.ceil(
      totalDaysToReachTargetUserShare / 91
    );
    const yearsToTargetUserShare = Math.ceil(
      totalDaysToReachTargetUserShare / 365
    );

    const projectedYearlyRevenue = dailyTotalRevenue * 365;
    const projectedYearlyUserShare = dailyUserShare * 365;
    const projectedMonthlyRevenue = dailyTotalRevenue * 30;
    const projectedMonthlyUserShare = dailyUserShare * 30;

    const averageRevenuePerSong = totalRevenue / Math.max(songCount, 1);
    const averageUserSharePerSong = totalUserShare / Math.max(songCount, 1);

    const exactYearsSinceRelease = daysSinceRelease / 365;

    const projectedYearlyRevenuePerSong =
      averageRevenuePerSong / exactYearsSinceRelease;
    const projectedYearlyUserSharePerSong =
      averageUserSharePerSong / exactYearsSinceRelease;
    const projectedMonthlyRevenuePerSong = projectedYearlyRevenuePerSong / 12;
    const projectedMonthlyUserSharePerSong =
      projectedYearlyUserSharePerSong / 12;

    const adjustedMonthlyRevenue =
      projectedMonthlyRevenue * (1 + INFLATION_RATE);
    const adjustedYearlyRevenue = projectedYearlyRevenue * (1 + INFLATION_RATE);
    const adjustedMonthlyUserShare =
      projectedMonthlyUserShare * (1 + INFLATION_RATE);
    const adjustedYearlyUserShare =
      projectedYearlyUserShare * (1 + INFLATION_RATE);

    setResult({
      totalStreams,
      totalRevenue,
      totalUserShare,
      daysSinceRelease,
      daysToTargetRevenue,
      daysToTargetUserShare,
      monthsToTargetRevenue,
      quartersToTargetRevenue,
      yearsToTargetRevenue,
      monthsToTargetUserShare,
      quartersToTargetUserShare,
      yearsToTargetUserShare,
      projectedYearlyRevenue,
      projectedYearlyUserShare,
      projectedMonthlyRevenue,
      projectedMonthlyUserShare,
      projectedYearlyRevenuePerSong,
      projectedMonthlyRevenuePerSong,
      projectedYearlyUserSharePerSong,
      projectedMonthlyUserSharePerSong,
      averageRevenuePerSong,
      averageUserSharePerSong,
      adjustedMonthlyRevenue,
      adjustedYearlyRevenue,
      adjustedMonthlyUserShare,
      adjustedYearlyUserShare,
    });
  };

  return (
    <div className="calculator">
      <h1>Streaming Revenue Calculator</h1>

      <div>
        <label>Number of Songs:</label>
        <input
          type="number"
          min="1"
          max="10"
          value={songCount}
          onChange={(e) => setSongCount(Number(e.target.value))}
        />
      </div>

      {[...Array(songCount)].map((_, index) => (
        <div key={index}>
          <label>Streams for Song {index + 1}:</label>
          <input
            type="number"
            value={streams[index]}
            onChange={(e) => handleStreamChange(index, e.target.value)}
          />
        </div>
      ))}

      <div>
        <label>Release Date:</label>
        <input
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
        />
      </div>

      <div>
        <label>Target Revenue ($):</label>
        <input
          type="number"
          step="0.01"
          value={targetRevenue}
          onChange={(e) => setTargetRevenue(e.target.value)}
        />
      </div>

      <div>
        <label>Master Ownership Split (%):</label>
        <input
          type="number"
          min="0"
          max="100"
          value={masterOwnershipSplit}
          onChange={(e) => setMasterOwnershipSplit(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Publishing Ownership Split (%):</label>
        <input
          type="number"
          min="0"
          max="100"
          value={publishingOwnershipSplit}
          onChange={(e) => setPublishingOwnershipSplit(Number(e.target.value))}
        />
      </div>

      <button onClick={calculateRevenue}>Calculate</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div>
          <h2>Results</h2>

          <h3>Revenue Overview</h3>
          <p>Album/EP Total Streams: {result.totalStreams.toLocaleString()}</p>
          <p>Album/EP Total Revenue: ${result.totalRevenue.toFixed(2)}</p>
          <p>Album/EP Total User Share: ${result.totalUserShare.toFixed(2)}</p>
          <p>
            Album/EP Projected Yearly Revenue: $
            {result.projectedYearlyRevenue.toFixed(2)}
          </p>
          <p>
            Album/EP Projected Yearly User Share: $
            {result.projectedYearlyUserShare.toFixed(2)}
          </p>
          <p>
            Average Total Revenue per Song: $
            {result.averageRevenuePerSong.toFixed(2)}
          </p>
          <p>
            Average User Revenue per Song: $
            {result.averageUserSharePerSong.toFixed(2)}
          </p>
          <p>
            Projected Yearly Revenue per Song: $
            {result.projectedYearlyRevenuePerSong.toFixed(2)}
          </p>
          <p>
            Projected Yearly User Share per Song: $
            {result.projectedYearlyUserSharePerSong.toFixed(2)}
          </p>

          <h3>Time to Target Revenue</h3>
          <p>Days: {result.daysToTargetRevenue}</p>
          <p>Months: {result.monthsToTargetRevenue}</p>
          <p>Quarters: {result.quartersToTargetRevenue}</p>
          <p>Years: {result.yearsToTargetRevenue}</p>

          <h3>Time to Target User Share</h3>
          <p>Days: {result.daysToTargetUserShare}</p>
          <p>Months: {result.monthsToTargetUserShare}</p>
          <p>Quarters: {result.quartersToTargetUserShare}</p>
          <p>Years: {result.yearsToTargetUserShare}</p>

          <h3>Projected Revenue</h3>
          <p>
            Projected Album/EP Yearly Revenue: $
            {result.projectedYearlyRevenue.toFixed(2)}
          </p>
          <p>
            Projected Album/EP Monthly Revenue: $
            {result.projectedMonthlyRevenue.toFixed(2)}
          </p>
          <p>
            Projected Album/EP Yearly User Share: $
            {result.projectedYearlyUserShare.toFixed(2)}
          </p>
          <p>
            Projected Album/EP Monthly User Share: $
            {result.projectedMonthlyUserShare.toFixed(2)}
          </p>
          <p>
            Projected Yearly Revenue per Song: $
            {result.projectedYearlyRevenuePerSong.toFixed(2)}
          </p>
          <p>
            Projected Monthly Revenue per Song: $
            {result.projectedMonthlyRevenuePerSong.toFixed(2)}
          </p>
          <p>
            Projected Yearly User Share per Song: $
            {result.projectedYearlyUserSharePerSong.toFixed(2)}
          </p>
          <p>
            Projected Monthly User Share per Song: $
            {result.projectedMonthlyUserSharePerSong.toFixed(2)}
          </p>

          <h3>Adjusted Revenue (Inflation)</h3>
          <p>
            Adjusted Monthly Revenue: $
            {result.adjustedMonthlyRevenue.toFixed(2)}
          </p>
          <p>
            Adjusted Yearly Revenue: ${result.adjustedYearlyRevenue.toFixed(2)}
          </p>
          <p>
            Adjusted Monthly User Share: $
            {result.adjustedMonthlyUserShare.toFixed(2)}
          </p>
          <p>
            Adjusted Yearly User Share: $
            {result.adjustedYearlyUserShare.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};

export default Calculator;
