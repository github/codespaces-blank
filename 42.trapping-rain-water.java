/*
 * @lc app=leetcode id=42 lang=java
 *
 * [42] Trapping Rain Water
 *
 * https://leetcode.com/problems/trapping-rain-water/description/
 *
 * algorithms
 * Hard (41.86%)
 * Total Accepted:    259.9K
 * Total Submissions: 618.9K
 * Testcase Example:  '[0,1,0,2,1,0,1,3,2,1,2,1]'
 *
 * Given n non-negative integers representing an elevation map where the width
 * of each bar is 1, compute how much water it is able to trap after raining.
 * 
 * 
 * The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1].
 * In this case, 6 units of rain water (blue section) are being trapped. Thanks
 * Marcos for contributing this image!
 * 
 * Example:
 * 
 * 
 * Input: [0,1,0,2,1,0,1,3,2,1,2,1]
 * Output: 6
 * 
 */

// Intuition As in Approach 2, instead of computing the left and right parts seperately, we may think of some way to do it in one iteration. 
// From the figure in dynamic programming approach, notice that as long as \text{right_max}[i]>\text{left_max}[i] (from element 0 to 6), 
// the water trapped depends upon the left_max, and similar is the case when \text{left_max}[i]>\text{right_max}[i] (from element 8 to 11). 
// So, we can say that if there is a larger bar at one end (say right), we are assured that the water trapped would be dependant on height of bar in current direction (from left to right). 
// As soon as we find the bar at other end (right) is smaller, we start iterating in opposite direction (from right to left). 
// We must maintain \text{left_max} and \text{right_max} during the iteration, but now we can do it in one iteration using 2 pointers, switching between the two.

// two pointers
class Solution {
    public int trap(int[] height) {
        int left = 0;
        int right = height.length - 1;
        int leftMax = 0;
        int rightMax = 0;
        int ans = 0;

        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) {
                    leftMax = height[left];
                } else {
                    ans += (leftMax - height[left]);
                }
                left++;
            } else {
                if (height[right] >= rightMax) {
                    rightMax = height[right];
                } else {
                    ans += (rightMax - height[right]);
                }
                right--;
            }
        }

        return ans;
    }
}

