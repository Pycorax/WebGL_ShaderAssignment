var ExtraMath =
{
	// Function to convert a degree angle into a radian angle
	DegreeToRadians : function (degree)
	{
		return degree * (Math.PI / 180.0);
	}
	,
	// Function to convert a radian angle into a degree angle
	RadianToDegrees : function (radian)
	{
		return radian * (180.0 / Math.PI);
	}
}
