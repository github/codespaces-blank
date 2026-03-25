/* =========================================
   AdventureWorks Internet Sales Analysis
   SQL Project
   ========================================= */


/* 1) Total Internet Sales Revenue */
SELECT 
    SUM(SalesAmount) AS Total_Internet_Sales
FROM dbo.FactInternetSales;


/* 2) Top 10 Revenue Generating Products */
SELECT TOP 10
    p.EnglishProductName,
    SUM(f.SalesAmount) AS TotalSales
FROM dbo.FactInternetSales f
JOIN dbo.DimProduct p
    ON f.ProductKey = p.ProductKey
GROUP BY p.EnglishProductName
ORDER BY TotalSales DESC;


/* 3️) Sales Trend by Year */
SELECT 
    d.CalendarYear,
    SUM(f.SalesAmount) AS TotalSales
FROM dbo.FactInternetSales f
JOIN dbo.DimDate d
    ON f.OrderDateKey = d.DateKey
GROUP BY d.CalendarYear
ORDER BY d.CalendarYear;


/* 4️) Top 10 Customers by Revenue */
SELECT TOP 10
    c.FirstName,
    c.LastName,
    SUM(f.SalesAmount) AS CustomerSales
FROM dbo.FactInternetSales f
JOIN dbo.DimCustomer c
    ON f.CustomerKey = c.CustomerKey
GROUP BY c.FirstName, c.LastName
ORDER BY CustomerSales DESC;


/* 5️) Sales by Country */
SELECT 
    g.EnglishCountryRegionName,
    SUM(f.SalesAmount) AS TotalSales
FROM dbo.FactInternetSales f
JOIN dbo.DimCustomer c
    ON f.CustomerKey = c.CustomerKey
JOIN dbo.DimGeography g
    ON c.GeographyKey = g.GeographyKey
GROUP BY g.EnglishCountryRegionName
ORDER BY TotalSales DESC;


/* 6️) Sales by Product Category */
SELECT 
    pc.EnglishProductCategoryName,
    SUM(f.SalesAmount) AS TotalSales
FROM dbo.FactInternetSales f
JOIN dbo.DimProduct p
    ON f.ProductKey = p.ProductKey
JOIN dbo.DimProductSubcategory ps
    ON p.ProductSubcategoryKey = ps.ProductSubcategoryKey
JOIN dbo.DimProductCategory pc
    ON ps.ProductCategoryKey = pc.ProductCategoryKey
GROUP BY pc.EnglishProductCategoryName
ORDER BY TotalSales DESC;


/* 7️) Internet Sales in Year 2013 */
SELECT 
    SUM(f.SalesAmount) AS Sales_2013
FROM dbo.FactInternetSales f
JOIN dbo.DimDate d
    ON f.OrderDateKey = d.DateKey
WHERE d.CalendarYear = 2013;


/* 8️) Average Order Value */
SELECT 
    AVG(SalesAmount) AS Avg_Order_Value
FROM dbo.FactInternetSales;


/* 9️) Total Quantity Sold by Product */
SELECT TOP 10
    p.EnglishProductName,
    SUM(f.OrderQuantity) AS TotalQuantitySold
FROM dbo.FactInternetSales f
JOIN dbo.DimProduct p
    ON f.ProductKey = p.ProductKey
GROUP BY p.EnglishProductName
ORDER BY TotalQuantitySold DESC;


/* 10) Monthly Sales Trend */
SELECT 
    d.CalendarYear,
    d.MonthNumberOfYear,
    SUM(f.SalesAmount) AS MonthlySales
FROM dbo.FactInternetSales f
JOIN dbo.DimDate d
    ON f.OrderDateKey = d.DateKey
GROUP BY d.CalendarYear, d.MonthNumberOfYear
ORDER BY d.CalendarYear, d.MonthNumberOfYear;
