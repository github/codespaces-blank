/*
 * @lc app=leetcode id=23 lang=java
 *
 * [23] Merge k Sorted Lists
 *
 * https://leetcode.com/problems/merge-k-sorted-lists/description/
 *
 * algorithms
 * Hard (32.80%)
 * Total Accepted:    348.1K
 * Total Submissions: 1M
 * Testcase Example:  '[[1,4,5],[1,3,4],[2,6]]'
 *
 * Merge k sorted linked lists and return it as one sorted list. Analyze and
 * describe its complexity.
 * 
 * Example:
 * 
 * 
 * Input:
 * [
 * 1->4->5,
 * 1->3->4,
 * 2->6
 * ]
 * Output: 1->1->2->3->4->4->5->6
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

 /*
  * 算法:
  * 创建一个k size的minHeap, 把list的头加入到minHeap中.
  * 选出一个最小的, 然后判断该list是否还有node, 如果有就加新的node到minHeap中
  */

// O(nklongk) runtime, O(k) space
// as wach insert operation into the minHeap costs logk and 
// there are a total of nk elements, the total runtime complexity is O(nklogk)
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        if (lists == null || lists.length == 0) {
            return null;
        }

        PriorityQueue<ListNode> minHeap = new PriorityQueue<ListNode>(lists.length, new Comparator<ListNode>(){
            @Override
            public int compare(ListNode n1, ListNode n2) {
                if (n1.val == n2.val) {
                    return 0;
                }
                return n1.val < n2.val ? -1 : 1;
            }
        });

        ListNode dummy = new ListNode(0);
        ListNode current = dummy;

        for (ListNode node : lists) {
            if (node != null) {
                minHeap.add(node);
            }
        }

        while (!minHeap.isEmpty()) {
            current.next = minHeap.poll();
            current = current.next;

            // 如果list后面还有node, 继续把node加入到minHeap中
            if (current.next != null) {
                minHeap.add(current.next);
            }
        }

        return dummy.next;
    }
}

/*
 * 要点１：
 * 如何把PriorityQueue变成minHeap:
    @Override
    public int compare(ListNode n1, ListNode n2) {
        if (n1.val == n2.val) {
            return 0;
        }
        return n1.val < n2.val ? -1 : 1;
    }
    如何把PriorityQueue变成maxHeap:
    @Override
    public int compare(ListNode n1, ListNode n2) {
        if (n1.val == n2.val) {
            return 0;
        }
        return n1.val > n2.val ? -1 : 1;
    }
 */

