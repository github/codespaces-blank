/*
 * @lc app=leetcode id=1512 lang=java
 *
 * [1512] Number of Good Pairs
 *
 * https://leetcode.com/problems/number-of-good-pairs/description/
 *
 * algorithms
 * Easy (89.04%)
 * Likes:    243
 * Dislikes: 12
 * Total Accepted:    30.8K
 * Total Submissions: 34.5K
 * Testcase Example:  '[1,2,3,1,1,3]'
 *
 * Given an array of integers nums.
 * 
 * A pair (i,j) is called good if nums[i] == nums[j] and i < j.
 * 
 * Return the number of good pairs.
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: nums = [1,2,3,1,1,3]
 * Output: 4
 * Explanation: There are 4 good pairs (0,3), (0,4), (3,4), (2,5) 0-indexed.
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: nums = [1,1,1,1]
 * Output: 6
 * Explanation: Each pair in the array are good.
 * 
 * 
 * Example 3:
 * 
 * 
 * Input: nums = [1,2,3]
 * Output: 0
 * 
 * 
 * 
 * Constraints:
 * 
 * 
 * 1 <= nums.length <= 100
 * 1 <= nums[i] <= 100
 * 
 */

// @lc code=start
// map里面存的是未添加现在值得count，我们把值赋给Result，就相当于完成了当前得配对
// https://leetcode.com/problems/number-of-good-pairs/discuss/731561/JavaC++Python-Count
// Time O(n), Space O(n)
class Solution {
    public int numIdenticalPairs(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }

        int result = 0;
        int[] map = new int[101];
        for (int i = 0; i < nums.length; i++) {
            result += map[nums[i]];
            map[nums[i]]++;
        }

        return result;
    }
}

class Solution {
    public int numIdenticalPairs(int[] nums) {
        if (nums == null || nums.length <= 1) {
            return 0;
        }
        
        // Move elements to a map
        Map<Integer, Integer> map = new HashMap<>();
        for (int i : nums) {
            map.put(i, map.getOrDefault(i, 0) + 1);
        }
        
        int result = 0;
        // Traverse map and doing math to calculate the results
        for (Map.Entry<Integer, Integer> entry : map.entrySet()) {
            if (entry.getValue() > 1) {
                result += calculatePairs(entry.getValue() - 1);
            }
        }
        
        return result;
    }
    
    private int calculatePairs(int value) {
        return (1 + value) * value / 2;
    }
}
// @lc code=end

