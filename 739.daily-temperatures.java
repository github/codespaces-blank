/*
 * @lc app=leetcode id=739 lang=java
 *
 * [739] Daily Temperatures
 *
 * https://leetcode.com/problems/daily-temperatures/description/
 *
 * algorithms
 * Medium (58.81%)
 * Total Accepted:    50.2K
 * Total Submissions: 85.3K
 * Testcase Example:  '[73,74,75,71,69,72,76,73]'
 *
 * 
 * Given a list of daily temperatures T, return a list such that, for each day
 * in the input, tells you how many days you would have to wait until a warmer
 * temperature.  If there is no future day for which this is possible, put 0
 * instead.
 * 
 * For example, given the list of temperatures T = [73, 74, 75, 71, 69, 72, 76,
 * 73], your output should be [1, 1, 4, 2, 1, 1, 0, 0].
 * 
 * 
 * Note:
 * The length of temperatures will be in the range [1, 30000].
 * Each temperature will be an integer in the range [30, 100].
 * 
 */

/* class Solution {
    public int[] dailyTemperatures(int[] T) {
        Stack<Integer> stack = new Stack<>();
        int[] result = new int[T.length];
        for (int i = 0; i < T.length; i++) {
            while (!stack.isEmpty() && T[i] > T[stack.peek()]) {
                int index = stack.pop();
                result[index] = i - index;
            }
            stack.push(i);
        }   
        return result;  
    }
} */

class Solution {
    public int[] dailyTemperatures(int[] T) {
         Stack<Integer> stack = new Stack<>();
         int[] ans = new int[T.length];
         stack.push(T.length - 1);
         for (int i = T.length - 2; i >= 0; i--) {
             while (!stack.isEmpty() && T[i] >= T[stack.peek()]) {
                 stack.pop();
             }
             if (!stack.isEmpty()) {
                 ans[i] = stack.peek() - i;
             }
             stack.push(i);
         }
         return ans;
    }
}
