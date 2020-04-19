import java.util.List;

/*
 * @lc app=leetcode id=1313 lang=java
 *
 * [1313] Decompress Run-Length Encoded List
 *
 * https://leetcode.com/problems/decompress-run-length-encoded-list/description/
 *
 * algorithms
 * Easy (84.75%)
 * Likes:    126
 * Dislikes: 393
 * Total Accepted:    43.5K
 * Total Submissions: 51.3K
 * Testcase Example:  '[1,2,3,4]'
 *
 * We are given a list nums of integers representing a list compressed with
 * run-length encoding.
 * 
 * Consider each adjacent pair of elements [freq, val] = [nums[2*i],
 * nums[2*i+1]] (with i >= 0).  For each such pair, there are freq elements
 * with value val concatenated in a sublist. Concatenate all the sublists from
 * left to right to generate the decompressed list.
 * 
 * Return the decompressed list.
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: nums = [1,2,3,4]
 * Output: [2,4,4,4]
 * Explanation: The first pair [1,2] means we have freq = 1 and val = 2 so we
 * generate the array [2].
 * The second pair [3,4] means we have freq = 3 and val = 4 so we generate
 * [4,4,4].
 * At the end the concatenation [2] + [4,4,4] is [2,4,4,4].
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: nums = [1,1,2,3]
 * Output: [1,3,3]
 * 
 * 
 * 
 * Constraints:
 * 
 * 
 * 2 <= nums.length <= 100
 * nums.length % 2 == 0
 * 1 <= nums[i] <= 100
 * 
 * 
 */

// @lc code=start
class Solution {
    public int[] decompressRLElist(int[] nums) {
        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < nums.length; i += 2) {
            for (int j = 0; j < nums[i]; j++) {
                result.add(nums[i + 1]);
            }
        }
        // convert integer arraylist to int array using java8 stream
        // https://stackoverflow.com/questions/960431/how-to-convert-listinteger-to-int-in-java#
        return result.stream().mapToInt(i -> i).toArray();
    }
}
// @lc code=end

