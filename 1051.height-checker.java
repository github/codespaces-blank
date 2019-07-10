/*
 * @lc app=leetcode id=1051 lang=java
 *
 * [1051] Height Checker
 *
 * https://leetcode.com/problems/height-checker/description/
 *
 * algorithms
 * Easy (69.44%)
 * Likes:    50
 * Dislikes: 380
 * Total Accepted:    14.1K
 * Total Submissions: 20.3K
 * Testcase Example:  '[1,1,4,2,1,3]'
 *
 * Students are asked to stand in non-decreasing order of heights for an annual
 * photo.
 * 
 * Return the minimum number of students not standing in the right positions.
 * (This is the number of students that must move in order for all students to
 * be standing in non-decreasing order of height.)
 * 
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: [1,1,4,2,1,3]
 * Output: 3
 * Explanation: 
 * Students with heights 4, 3 and the last 1 are not standing in the right
 * positions.
 * 
 * 
 * 
 * 
 * Note:
 * 
 * 
 * 1 <= heights.length <= 100
 * 1 <= heights[i] <= 100
 * 
 */
class Solution {
    public int heightChecker(int[] heights) {
        if (heights == null || heights.length < 2) {
            return 0;
        }

        // put height and the frequent into array
        // because heights starts from 1 to 100, so the array length should be 101.
        // because we never use index 0.
        int[] heightToFreq = new int[101];
        for (int height : heights) {
            heightToFreq[height]++;
        }

        int result = 0;
        int currentHeight = 0;
        for (int i = 0; i < heights.length; i++) {
            while (heightToFreq[currentHeight] == 0) {
                currentHeight++;
            }
            if (currentHeight != heights[i]) {
                result++;
            }
            heightToFreq[currentHeight]--;
        }

        return result;
    }
}

