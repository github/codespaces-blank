import java.util.Map;

/*
 * @lc app=leetcode id=13 lang=java
 *
 * [13] Roman to Integer
 *
 * https://leetcode.com/problems/roman-to-integer/description/
 *
 * algorithms
 * Easy (51.54%)
 * Total Accepted:    376.2K
 * Total Submissions: 727.1K
 * Testcase Example:  '"III"'
 *
 * Roman numerals are represented by seven different symbols: I, V, X, L, C, D
 * and M.
 * 
 * 
 * Symbol       Value
 * I             1
 * V             5
 * X             10
 * L             50
 * C             100
 * D             500
 * M             1000
 * 
 * For example, two is written as II in Roman numeral, just two one's added
 * together. Twelve is written as, XII, which is simply X + II. The number
 * twenty seven is written as XXVII, which is XX + V + II.
 * 
 * Roman numerals are usually written largest to smallest from left to right.
 * However, the numeral for four is not IIII. Instead, the number four is
 * written as IV. Because the one is before the five we subtract it making
 * four. The same principle applies to the number nine, which is written as IX.
 * There are six instances where subtraction is used:
 * 
 * 
 * I can be placed before V (5) and X (10) to make 4 and 9. 
 * X can be placed before L (50) and C (100) to make 40 and 90. 
 * C can be placed before D (500) and M (1000) to make 400 and 900.
 * 
 * 
 * Given a roman numeral, convert it to an integer. Input is guaranteed to be
 * within the range from 1 to 3999.
 * 
 * Example 1:
 * 
 * 
 * Input: "III"
 * Output: 3
 * 
 * Example 2:
 * 
 * 
 * Input: "IV"
 * Output: 4
 * 
 * Example 3:
 * 
 * 
 * Input: "IX"
 * Output: 9
 * 
 * Example 4:
 * 
 * 
 * Input: "LVIII"
 * Output: 58
 * Explanation: L = 50, V= 5, III = 3.
 * 
 * 
 * Example 5:
 * 
 * 
 * Input: "MCMXCIV"
 * Output: 1994
 * Explanation: M = 1000, CM = 900, XC = 90 and IV = 4.
 * 
 */
class Solution {
    public int romanToInt(String s) {
        int result = 0;
        for (int i = 0; i < s.length(); i++) {
            int s1 = romanToNumber(s.charAt(i));
            if (i + 1 < s.length()) {
                int s2 = romanToNumber(s.charAt(i + 1));
                if (s1 >= s2) {
                    // current integer is bigger than next, ignore
                    result = result + s1;
                } else {
                    // current integer is smaller than next, it means we need to subtract current from next
                    // remember to i++, because next element is used at current round
                    result = result + s2 - s1;
                    i++;
                }
            } else { // this is last char in input string
                result = result + s1;
                i++;
            }
        }
        return result;
    }

    private int romanToNumber(char r) {
        int ans = 0;
        switch (r) {
            case 'I':
                ans = 1;
                break;
            case 'V':
                ans = 5;
                break;
            case 'X': 
                ans = 10;
                break;
            case 'L':
                ans = 50;
                break;
            case 'C':
                ans = 100;
                break;
            case 'D':
                ans = 500;
                break;
            case 'M':
                ans = 1000;
                break;
            default:
                ans = -1;
        }
        return ans;
    }
}

// When the prev is smaller than current integer, we need to subtract the prev one.
// However, in this solution, we already added the prev one. So we need to subtract twice of prev one
// MXC  1010 + (100 - 2 * 10)
class Solution {
    public int romanToInt(String s) {
        Map<Character, Integer> map = new HashMap<>(); {
            put('I', 1);
            put('V', 5);
            put('X', 10);
            put('L', 50);
            put('C', 100);
            put('D', 500);
            put('M', 1000);
        }
        int prev = 0;
        int total = 0;
        
        for (char c : s.toCharArray()) {
            int current = map.get(c);
            total += (current > prev) ? (current - 2 * prev) : current;
            prev = current;
        }

        return total;
    }
}

