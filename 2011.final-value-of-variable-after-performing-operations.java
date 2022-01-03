/*
 * @lc app=leetcode id=2011 lang=java
 *
 * [2011] Final Value of Variable After Performing Operations
 *
 * https://leetcode.com/problems/final-value-of-variable-after-performing-operations/description/
 *
 * algorithms
 * Easy (89.41%)
 * Likes:    277
 * Dislikes: 62
 * Total Accepted:    53.8K
 * Total Submissions: 60.2K
 * Testcase Example:  '["--X","X++","X++"]'
 *
 * There is a programming language with only four operations and one variable
 * X:
 * 
 * 
 * ++X and X++ increments the value of the variable X by 1.
 * --X and X-- decrements the value of the variable X by 1.
 * 
 * 
 * Initially, the value of X is 0.
 * 
 * Given an array of strings operations containing a list of operations, return
 * the final value of X after performing all the operations.
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: operations = ["--X","X++","X++"]
 * Output: 1
 * Explanation: The operations are performed as follows:
 * Initially, X = 0.
 * --X: X is decremented by 1, X =  0 - 1 = -1.
 * X++: X is incremented by 1, X = -1 + 1 =  0.
 * X++: X is incremented by 1, X =  0 + 1 =  1.
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: operations = ["++X","++X","X++"]
 * Output: 3
 * Explanation: The operations are performed as follows:
 * Initially, X = 0.
 * ++X: X is incremented by 1, X = 0 + 1 = 1.
 * ++X: X is incremented by 1, X = 1 + 1 = 2.
 * X++: X is incremented by 1, X = 2 + 1 = 3.
 * 
 * 
 * Example 3:
 * 
 * 
 * Input: operations = ["X++","++X","--X","X--"]
 * Output: 0
 * Explanation: The operations are performed as follows:
 * Initially, X = 0.
 * X++: X is incremented by 1, X = 0 + 1 = 1.
 * ++X: X is incremented by 1, X = 1 + 1 = 2.
 * --X: X is decremented by 1, X = 2 - 1 = 1.
 * X--: X is decremented by 1, X = 1 - 1 = 0.
 * 
 * 
 * 
 * Constraints:
 * 
 * 
 * 1 <= operations.length <= 100
 * operations[i] will be either "++X", "X++", "--X", or "X--".
 * 
 * 
 */

// @lc code=start
class Solution {
    public int finalValueAfterOperations(String[] operations) {
        if (operations == null || operations.length < 1) {
            return 0;
        }

        int result = 0;
        for (String operation : operations) {
            result += operation.charAt(1) == '+' ? 1 : -1;
        }

        return result;
    }
}

class Solution {
    public int finalValueAfterOperations(String[] operations) {
        if (operations == null || operations.length < 1) {
            return 0;
        }

        int result = 0;
        for (int i = 0; i < operations.length; i++) {
            if (operations[i].contains("+")) {
                result++;
            } else {
                result--;
            }
        }

        return result;
    }
}
// @lc code=end

