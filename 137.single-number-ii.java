/*
 * @lc app=leetcode id=137 lang=java
 *
 * [137] Single Number II
 *
 * https://leetcode.com/problems/single-number-ii/description/
 *
 * algorithms
 * Medium (45.05%)
 * Total Accepted:    159.3K
 * Total Submissions: 352K
 * Testcase Example:  '[2,2,3,2]'
 *
 * Given a non-empty array of integers, every element appears three times
 * except for one, which appears exactly once. Find that single one.
 * 
 * Note:
 * 
 * Your algorithm should have a linear runtime complexity. Could you implement
 * it without using extra memory?
 * 
 * Example 1:
 * 
 * 
 * Input: [2,2,3,2]
 * Output: 3
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: [0,1,0,1,0,1,99]
 * Output: 99
 * 
 */

 /**
  * The usual bit manipulation code is bit hard to get and replicate. 
  I like to think about the number in 32 bits and just count how many 1s are there in each bit, and sum %= 3 will clear it once it reaches 3. 
  After running for all the numbers for each bit, if we have a 1, then that 1 belongs to the single number, 
  we can simply move it back to its spot by doing ans |= sum << i;

This has complexity of O(32n), which is essentially O(n) and very easy to think and implement. 
Plus, you get a general solution for any times of occurrence. Say all the numbers have 5 times, just do sum %= 5.
  */
class Solution {
    public int singleNumber(int[] nums) {
        int ans = 0;
        for (int i = 0; i < 32; i++) {
            int sum = 0;
            for (int j = 0; j < nums.length; j++) {
                if (((nums[j] >> i) & 1) == 1) {
                    sum++;
                    sum %= 3;
                }
            }
            
            // if it is 1, move it back to origin position
            if (sum != 0) {
                ans |= sum << i;
            }
        }
        return ans;
    }
}

