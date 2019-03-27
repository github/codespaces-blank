/*
 * @lc app=leetcode id=285 lang=java
 *
 * [285] Inorder Successor in BST
 *
 * https://leetcode.com/problems/inorder-successor-in-bst/description/
 *
 * algorithms
 * Medium (33.17%)
 * Total Accepted:    99.2K
 * Total Submissions: 293.4K
 * Testcase Example:  '[2,1,3]\n1'
 *
 * Given a binary search tree and a node in it, find the in-order successor of
 * that node in the BST.
 * 
 * The successor of a node p is the node with the smallest key greater than
 * p.val.
 * 
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: root = [2,1,3], p = 1
 * Output: 2
 * Explanation: 1's in-order successor node is 2. Note that both p and the
 * return value is of TreeNode type.
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: root = [5,3,6,2,4,null,null,1], p = 6
 * Output: null
 * Explanation: There is no in-order successor of the current node, so the
 * answer is null.
 * 
 * 
 * 
 * 
 * Note:
 * 
 * 
 * If the given node has no in-order successor in the tree, return null.
 * It's guaranteed that the values of the tree are unique.
 * 
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
/**
 * The inorder traversal of a BST is the nodes in ascending order. 
 * To find a successor, you just need to find the smallest one that is larger than the given value since there are no duplicate values in a BST. 
 * It just like the binary search in a sorted list. The time complexity should be O(h) where h is the depth of the result node. 
 * succ is a pointer that keeps the possible successor. 
 * Whenever you go left the current root is the new possible successor, otherwise the it remains the same.
 * Only in a balanced BST O(h) = O(log n). In the worst case h can be as large as n.
 * 
 * 
 * The idea is to compare root's value with p's value if root is not null, and consider the following two cases:
 * root.val > p.val. In this case, root can be a possible answer, so we store the root node first and call it res. 
 * However, we don't know if there is anymore node on root's left that is larger than p.val. So we move root to its left and check again.
 * root.val <= p.val. In this case, root cannot be p's inorder successor, neither can root's left child. 
 * So we only need to consider root's right child, thus we move root to its right and check again.
 * We continuously move root until exhausted. To this point, we only need to return the res in case 1.
 */
// class Solution {
//     public TreeNode inorderSuccessor(TreeNode root, TreeNode p) {
//         TreeNode successor = null;
//         while (root != null) {
//             if (p.val < root.val) {
//                 successor = root;
//                 root = root.left;
//             } else {
//                 root = root.right;
//             }
//         }
//         return successor;
//     }
// }

class Solution {
    public TreeNode inorderSuccessor(TreeNode root, TreeNode p) {
        if (root == null) {
            return null;
        }

        // if current val <= p, we go right subtree
        if (root.val <= p.val) {
            return inorderSuccessor(root.right, p);
        } else {
            // go left subtree as far as we can
            TreeNode left = inorderSuccessor(root.left, p);
            return left == null ? root : left;
        }
    }
}

