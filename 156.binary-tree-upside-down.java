/*
 * @lc app=leetcode id=156 lang=java
 *
 * [156] Binary Tree Upside Down
 *
 * https://leetcode.com/problems/binary-tree-upside-down/description/
 *
 * algorithms
 * Medium (49.43%)
 * Total Accepted:    44.4K
 * Total Submissions: 89.4K
 * Testcase Example:  '[1,2,3,4,5]'
 *
 * Given a binary tree where all the right nodes are either leaf nodes with a
 * sibling (a left node that shares the same parent node) or empty, flip it
 * upside down and turn it into a tree where the original right nodes turned
 * into left leaf nodes. Return the new root.
 * 
 * Example:
 * 
 * 
 * Input: [1,2,3,4,5]
 * 
 * ⁠   1
 * ⁠  / \
 * ⁠ 2   3
 * ⁠/ \
 * 4   5
 * 
 * Output: return the root of the binary tree [4,5,2,#,#,3,1]
 * 
 * ⁠  4
 * ⁠ / \
 * ⁠5   2
 * ⁠   / \
 * ⁠  3   1  
 * 
 * 
 * Clarification:
 * 
 * Confused what [4,5,2,#,#,3,1] means? Read more below on how binary tree is
 * serialized on OJ.
 * 
 * The serialization of a binary tree follows a level order traversal, where
 * '#' signifies a path terminator where no node exists below.
 * 
 * Here's an example:
 * 
 * 
 * ⁠  1
 * ⁠ / \
 * ⁠2   3
 * ⁠   /
 * ⁠  4
 * ⁠   \
 * ⁠    5
 * 
 * 
 * The above binary tree is serialized as [1,2,3,#,#,4,#,#,5].
 * 
 */
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */

// https://leetcode.com/problems/binary-tree-upside-down/discuss/49406/Java-recursive-(O(logn)-space)-and-iterative-solutions-(O(1)-space)-with-explanation-and-figure

// Recursive
// class Solution {
//     public TreeNode upsideDownBinaryTree(TreeNode root) {
//         if (root == null || root.left == null) {
//             return root;
//         }

//         TreeNode newRoot = upsideDownBinaryTree(root.left);
//         root.left.left = root.right;
//         root.left.right = root;
//         root.left = null;
//         root.right = null;
//         return newRoot;
//     }
// }

// Iterative
class Solution {
    public TreeNode upsideDownBinaryTree(TreeNode root) {
        if (root == null || root.left == null) {
            return root;
        }

        TreeNode current = root;
        TreeNode next = null;
        TreeNode temp = null;
        TreeNode prev = null;

        while (current != null) {
            next = current.left;

            // swap nodes now, need temp to keep the previous right child
            current.left = temp;
            temp = current.right;
            current.right = prev;

            prev = current;
            current = next;
        }
        return prev;
    }
}

