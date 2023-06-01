#include  "tree.h"

std::vector<char> getPerm(const Tree& tree, int n) {
  // напишите реализацию
	vector<Node*> level = vector<Node*>(tree.enter);
	int len = tree.enter.size(); 
	int N = n , s=0, add=0;
	std::vector<int> path(len);
	std::vector<char> out(0);
	if (n > factorial(len)*len) return out;
	for (int i = 0; i < len; i++) {
		add=factorial(len-i);
		s = 0;
		for (int j = 0; j < len - i; j++) {
			s = s + add;
			if (s >= N) {
				path[i] = j;
				N = N - add * j;
				break;
			}
		}
	}
	cout << endl; cout << endl; cout << endl; cout << endl;
	cout << "variant namber " << n << "  :  ";
	for (int k = 0; k < len; k++) {
		cout << level[path[k]]->c;
		out.push_back(level[path[k]]->c);
		level = level[path[k]]->v;
	}
	cout << endl;
	return out;
}

int main() {
  // определяем входной вектор для дерева
  std::vector<char> in = {'1', '2', '3'};

  // создаем дерево
  Tree tree(in);

  // запрашиваем первую перестановку
  std::vector<char> result1 = getPerm(tree, 1);  //  123
  // запрашиваем вторую перестановку
  std::vector<char> result2 = getPerm(tree, 2);  //  132
  // запрашиваем вторую перестановку
  std::vector<char> result3 = getPerm(tree, 6);  //  132
  // запрашиваем вторую перестановку
  std::vector<char> result4 = getPerm(tree, 8);  //  132
  cout << "result4.size()=" << result4.size();
  return 0;
}
