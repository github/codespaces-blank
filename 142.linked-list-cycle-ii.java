/*
 * @lc app=leetcode id=142 lang=java
 *
 * [142] Linked List Cycle II
 *
 * https://leetcode.com/problems/linked-list-cycle-ii/description/
 *
 * algorithms
 * Medium (45.47%)
 * Likes:    9986
 * Dislikes: 733
 * Total Accepted:    919.3K
 * Total Submissions: 2M
 * Testcase Example:  '[3,2,0,-4]\n1'
 *
 * Given the head of a linked list, return the node where the cycle begins. If
 * there is no cycle, return null.
 * 
 * There is a cycle in a linked list if there is some node in the list that can
 * be reached again by continuously following the next pointer. Internally, pos
 * is used to denote the index of the node that tail's next pointer is
 * connected to (0-indexed). It is -1 if there is no cycle. Note that pos is
 * not passed as a parameter.
 * 
 * Do not modify the linked list.
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: head = [3,2,0,-4], pos = 1
 * Output: tail connects to node index 1
 * Explanation: There is a cycle in the linked list, where tail connects to the
 * second node.
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: head = [1,2], pos = 0
 * Output: tail connects to node index 0
 * Explanation: There is a cycle in the linked list, where tail connects to the
 * first node.
 * 
 * 
 * Example 3:
 * 
 * 
 * Input: head = [1], pos = -1
 * Output: no cycle
 * Explanation: There is no cycle in the linked list.
 * 
 * 
 * 
 * Constraints:
 * 
 * 
 * The number of the nodes in the list is in the range [0, 10^4].
 * -10^5 <= Node.val <= 10^5
 * pos is -1 or a valid index in the linked-list.
 * 
 * 
 * 
 * Follow up: Can you solve it using O(1) (i.e. constant) memory?
 * 
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
// Solution 1: HashSet
public class Solution {
    public ListNode detectCycle(ListNode head) {
        Set<ListNode> seen = new HashSet<>();
        while (head != null) {
            if (!seen.add(head)) {
                return head;
            }
            head = head.next;
        }

        return null;
    }
}

// Solution 2
public class Solution {
    public ListNode detectCycle(ListNode head) {
        if (head == null || head.next == null) {
            return null;
        }

        // If there is a cycle, the fast/slow pointers will intersect at some
        // node. Otherwise, there is no cycle, so we cannot find an entrance to
        // a cycle.
        ListNode intersect = getIntersect(head);
        if (intersect == null) {
            return null;
        }

        // To find the entrance to the cycle, we have two pointers traverse at
        // the same speed -- one from the front of the list, and the other from
        // the point of intersection.
        ListNode point1 = head;
        ListNode point2 = intersect;
        while (point1 != point2) {
            point1 = point1.next;
            point2 = point2.next;
        }
        return point1;
    }

    private ListNode getIntersect(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;

        // A fast pointer will either loop around a cycle and meet the slow
        // pointer or reach the `null` at the end of a non-cyclic list.
        while (fast.next != null && fast.next.next != null) {
            fast = fast.next.next;
            slow = slow.next;
            if (fast == slow) {
                return fast;
            }
        }

        return null;
    }
}
// @lc code=end

