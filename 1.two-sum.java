import java.util.HashMap;
import java.util.Map;

/*
 * @lc app=leetcode id=1 lang=java
 *
 * [1] Two Sum
 *
 * https://leetcode.com/problems/two-sum/description/
 *
 * algorithms
 * Easy (41.89%)
 * Total Accepted:    1.5M
 * Total Submissions: 3.6M
 * Testcase Example:  '[2,7,11,15]\n9'
 *
 * Given an array of integers, return indices of the two numbers such that they
 * add up to a specific target.
 * 
 * You may assume that each input would have exactly one solution, and you may
 * not use the same element twice.
 * 
 * Example:
 * 
 * 
 * Given nums = [2, 7, 11, 15], target = 9,
 * 
 * Because nums[0] + nums[1] = 2 + 7 = 9,
 * return [0, 1].
 * 
 * 
 * 
 * 
 */


// Solution 1
// brute force with two loops
// Time: O(n2)
// Space: O(1)
class Solution {
    public int[] twoSum(int[] nums, int target) {
        int[] results = new int[2];

        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    results[0] = i;
                    results[1] = j;
                    return results;
                }
            }
        }

        return results;
    }
}

// Solution 2
// One pass with HashMap
// Time: O(n)
// Space: O(n)
class Solution {
    public int[] twoSum(int[] nums, int target) {
        int[] results = new int[2];
        Map<Integer, Integer> map = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            map.put(nums[i], i);
        }

        for (int i = 0; i < nums.length; i++) {
            int sub = target - nums[i];
            // 还需判断找到的元素不是当前元素
            if (map.containsKey(sub) && map.get(sub) != i) {
                results[0] = i;
                results[1] = map.get(sub);
                return results;
            }
        }

        return results;
    }
}

// Solution 3
// one pass with HashMap
// Time complexity: O(n)
// Space complexity: O(n)
class Solution {
    public int[] twoSum(int[] nums, int target) {
        if (nums == null || nums.length < 2) {
            return new int[]{};
        }
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            // 不需要判断是不是当前元素了，因为当前元素还没有添加进 map 里
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}

