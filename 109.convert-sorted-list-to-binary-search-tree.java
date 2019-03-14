/*
 * @lc app=leetcode id=109 lang=java
 *
 * [109] Convert Sorted List to Binary Search Tree
 *
 * https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/description/
 *
 * algorithms
 * Medium (39.44%)
 * Total Accepted:    165.9K
 * Total Submissions: 417.6K
 * Testcase Example:  '[-10,-3,0,5,9]'
 *
 * Given a singly linked list where elements are sorted in ascending order,
 * convert it to a height balanced BST.
 * 
 * For this problem, a height-balanced binary tree is defined as a binary tree
 * in which the depth of the two subtrees of every node never differ by more
 * than 1.
 * 
 * Example:
 * 
 * 
 * Given the sorted linked list: [-10,-3,0,5,9],
 * 
 * One possible answer is: [0,-3,9,-10,null,5], which represents the following
 * height balanced BST:
 * 
 * ⁠     0
 * ⁠    / \
 * ⁠  -3   9
 * ⁠  /   /
 * ⁠-10  5
 * 
 * 
 */
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
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

 // O(nlogn) runtime, O(logn) space
class Solution {
    public TreeNode sortedListToBST(ListNode head) {
        if (head == null) {
            return null;
        }
        ListNode mid = findMiddleElement(head);
        TreeNode node = new TreeNode(mid.val);

        // Base case when there is just one element in the linked list
        if (head == mid) {
            return node;
        }

        // Recursively from balanced BSTs using the left and right halves of the original list
        node.left = sortedListToBST(head);
        node.right = sortedListToBST(mid.next);
        return node;
    }

    private ListNode findMiddleElement(ListNode head) {
        // The pointer used to disconnect the left half from the mid node
        ListNode prev = null;
        ListNode slow = head;
        ListNode fast = head;

        // Iterate until fast doesn't reach the end of the linked list
        while (fast != null && fast.next != null) {
            prev = slow;
            slow = slow.next;
            fast = fast.next.next;
        }

        // Handling the case when slow was equal to head
        if (prev != null) {
            prev.next = null;
        }
        return slow;
    }
}

// O(n) runtime, O(logn) space
class Solution {
    private ListNode head;

    public TreeNode sortedListToBST(ListNode head) {
        // Get the size of the linked list first
        int size = findSize(head);
        this.head = head;

        // Form the BST now that we know the size
        return convertListToBST(0, size - 1);
    }

    private int findSize(ListNode head) {
        ListNode current = head;
        int length = 0;
        while (current != null) {
            current = current.next;
            length++;
        }
        return length;
    }

    private TreeNode convertListToBST(int l, int r) {
        if (l > r) {
            return null;
        }
        int mid = (l + r) / 2;

        // First step of simulated inorder traversal. Recursively from the left half
        TreeNode left = convertListToBST(l, mid - 1);

        // Once left half is traversed, process the current node
        TreeNode node = new TreeNode(this.head.val);
        node.left = left;

        // Maintain the invariance mentioned in the algorithm
        this.head = this.head.next;

        // Recurse on the right hand side and form BST out of them
        node.right = convertListToBST(mid + 1, r);
        return node;
    }
}
