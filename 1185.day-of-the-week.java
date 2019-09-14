/*
 * @lc app=leetcode id=1185 lang=java
 *
 * [1185] Day of the Week
 *
 * https://leetcode.com/problems/day-of-the-week/description/
 *
 * algorithms
 * Easy (65.80%)
 * Likes:    15
 * Dislikes: 206
 * Total Accepted:    5.9K
 * Total Submissions: 9K
 * Testcase Example:  '31\n8\n2019'
 *
 * Given a date, return the corresponding day of the week for that date.
 * 
 * The input is given as three integers representing the day, month and year
 * respectively.
 * 
 * Return the answer as one of the following values {"Sunday", "Monday",
 * "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"}.
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: day = 31, month = 8, year = 2019
 * Output: "Saturday"
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: day = 18, month = 7, year = 1999
 * Output: "Sunday"
 * 
 * 
 * Example 3:
 * 
 * 
 * Input: day = 15, month = 8, year = 1993
 * Output: "Sunday"
 * 
 * 
 * 
 * Constraints:
 * 
 * 
 * The given dates are valid dates between the years 1971 and 2100.
 * 
 */
class Solution {
    int[] months = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
    String[] res = {"Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"};
    
    public String dayOfTheWeek(int day, int month, int year) {
        int days = year(year);
        if (isLeapYear(year)) {
            months[2] = 29;
        }
        for (int i = 0; i < month; i++) {
            days += months[i];
        }
        days += day - 1;
        return res[days % 7];
    }
    
    private int year(int year) {
        int count = 0;
        for(int i = 1971; i < year; i++){
            if(isLeapYear(i))
               count += 366;    
            else
               count += 365;    
        }
        return count;
    }
    
    
    private boolean isLeapYear(int year) {
        if (year % 4 != 0) {
            return false;
        } else if (year % 100 != 0) {
            return true;
        } else if (year % 400 != 0) {
            return false;
        }
        return true;
    }
}

