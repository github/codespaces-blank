import java.util.HashMap;

/*
 * @lc app=leetcode id=2367 lang=java
 *
 * [2367] Number of Arithmetic Triplets
 *
 * https://leetcode.com/problems/number-of-arithmetic-triplets/description/
 *
 * algorithms
 * Easy (84.21%)
 * Likes:    668
 * Dislikes: 25
 * Total Accepted:    57.9K
 * Total Submissions: 69.2K
 * Testcase Example:  '[0,1,4,6,7,10]\n3'
 *
 * You are given a 0-indexed, strictly increasing integer array nums and a
 * positive integer diff. A triplet (i, j, k) is an arithmetic triplet if the
 * following conditions are met:
 * 
 * 
 * i < j < k,
 * nums[j] - nums[i] == diff, and
 * nums[k] - nums[j] == diff.
 * 
 * 
 * Return the number of unique arithmetic triplets.
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: nums = [0,1,4,6,7,10], diff = 3
 * Output: 2
 * Explanation:
 * (1, 2, 4) is an arithmetic triplet because both 7 - 4 == 3 and 4 - 1 == 3.
 * (2, 4, 5) is an arithmetic triplet because both 10 - 7 == 3 and 7 - 4 ==
 * 3. 
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: nums = [4,5,6,7,8,9], diff = 2
 * Output: 2
 * Explanation:
 * (0, 2, 4) is an arithmetic triplet because both 8 - 6 == 2 and 6 - 4 == 2.
 * (1, 3, 5) is an arithmetic triplet because both 9 - 7 == 2 and 7 - 5 ==
 * 2.
 * 
 * 
 * 
 * Constraints:
 * 
 * 
 * 3 <= nums.length <= 200
 * 0 <= nums[i] <= 200
 * 1 <= diff <= 50
 * nums is strictly increasing.
 * 
 * 
 */

// @lc code=start
class Solution {
    public int arithmeticTriplets(int[] nums, int diff) {
        if (nums == null || nums.length < 3) {
            return 0;
        }

        int result = 0;
        HashMap<Integer, Integer> maps = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            if (maps.containsKey(nums[i] - diff) && maps.containsKey(nums[i] - 2 * diff)) {
                result++;
            }
            maps.put(nums[i], i);
        }

        return result;
    }
}
// @lc code=end

