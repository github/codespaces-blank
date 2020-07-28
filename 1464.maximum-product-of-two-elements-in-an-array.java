/*
 * @lc app=leetcode id=1464 lang=java
 *
 * [1464] Maximum Product of Two Elements in an Array
 *
 * https://leetcode.com/problems/maximum-product-of-two-elements-in-an-array/description/
 *
 * algorithms
 * Easy (77.86%)
 * Likes:    164
 * Dislikes: 40
 * Total Accepted:    34.1K
 * Total Submissions: 43.8K
 * Testcase Example:  '[3,4,5,2]'
 *
 * Given the array of integers nums, you will choose two different indices i
 * and j of that array. Return the maximum value of (nums[i]-1)*(nums[j]-1).
 * 
 * Example 1:
 * 
 * 
 * Input: nums = [3,4,5,2]
 * Output: 12 
 * Explanation: If you choose the indices i=1 and j=2 (indexed from 0), you
 * will get the maximum value, that is, (nums[1]-1)*(nums[2]-1) = (4-1)*(5-1) =
 * 3*4 = 12. 
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: nums = [1,5,4,5]
 * Output: 16
 * Explanation: Choosing the indices i=1 and j=3 (indexed from 0), you will get
 * the maximum value of (5-1)*(5-1) = 16.
 * 
 * 
 * Example 3:
 * 
 * 
 * Input: nums = [3,7]
 * Output: 12
 * 
 * 
 * 
 * Constraints:
 * 
 * 
 * 2 <= nums.length <= 500
 * 1 <= nums[i] <= 10^3
 * 
 * 
 */

// @lc code=start
class Solution {
    public int maxProduct(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }

        int m = Integer.MIN_VALUE;
        int n = Integer.MIN_VALUE;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] > m) {
                n = m;
                m = nums[i];
            } else if (nums[i] > n) {
                n = nums[i];
            }
        }

        return (m - 1) * (n - 1);
    }
}

/**
 * when input array element can be negative values
 */
public int maxProduct(int[] nums) {
    int max1 = Integer.MIN_VALUE;
    int max2 = Integer.MIN_VALUE;
    int min1 = Integer.MAX_VALUE;
    int min2 = Integer.MAX_VALUE;
    
    for(int i = 0;i < nums.length;i++){
        if(nums[i] > max1){
            max2 = max1;
            max1 = nums[i];
        }else if(nums[i] > max2){
            max2 = nums[i];
        }
        
        if(nums[i] < min1){
            min2 = min1;
            min1 = nums[i];
        }else if(nums[i] < min2){
            min2 = nums[i];
        }
    }
    
    return Math.max((min1-1)*(min2-1),(max1-1)*(max2-1));
}
// @lc code=end

