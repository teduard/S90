import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type {
  IExpenseRow,
  IExpenseCategoryAggregateRow,
} from "../modules/ExpenseApp/interfaces/data";
import { logger } from "../lib/logger";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },

  // Header
  header: {
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: "#0972d3",
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#0972d3",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: "#5f6b7a",
  },

  // Summary cards row
  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    borderRadius: 4,
    padding: 12,
  },
  summaryLabel: {
    fontSize: 8,
    color: "#5f6b7a",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#0972d3",
  },

  // Section
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    marginBottom: 8,
    marginTop: 16,
  },

  // Category table
  categoryRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ebed",
  },
  categoryRowAlt: {
    backgroundColor: "#f8f9fa",
  },
  categoryName: {
    flex: 2,
  },
  categoryAmount: {
    flex: 1,
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0972d3",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 2,
    marginBottom: 2,
  },
  tableHeaderText: {
    color: "#ffffff",
    fontSize: 9,
  },

  // Expense rows
  expenseRow: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ebed",
    alignItems: "center",
  },
  expenseDateCol: { width: 80 },
  expenseCatCol: { flex: 1 },
  expenseComCol: { flex: 2 },
  expenseAmtCol: { width: 50, textAlign: "right" },
  expenseAvdCol: { width: 50, textAlign: "center" },

  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e9ebed",
    paddingTop: 8,
    color: "#8d99a5",
    fontSize: 8,
  },
});

interface IExpenseReportProps {
  expenses: IExpenseRow[];
  categoryAggregate: IExpenseCategoryAggregateRow[];
  total: number;
  currency: string;
  month: string;
  userName: string;
}

export function ExpenseReport({
  expenses,
  categoryAggregate,
  total,
  currency,
  month,
  userName,
}: IExpenseReportProps) {
  const avoidableCount = expenses.filter((e) => e.couldHaveBeenAvoided).length;
  const avoidableTotal = expenses
    .filter((e) => e.couldHaveBeenAvoided)
    .reduce((sum, e) => sum + e.amount, 0);

  const generatedOn = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Sort categories by amount descending
  const sortedCategories = [...categoryAggregate].sort(
    (a, b) => b.categoryAmount - a.categoryAmount,
  );

  logger.debug("TOTAL:");
  logger.debug(total);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Expense Report</Text>
          <Text style={styles.subtitle}>
            {userName} / {month} / Generated on {generatedOn}
          </Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Spent</Text>
            <Text style={styles.summaryValue}>
              {total} {currency}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Transactions</Text>
            <Text style={styles.summaryValue}>{expenses.length}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Avoidable</Text>
            <Text style={styles.summaryValue}>
              {avoidableTotal} {currency}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Avoidable Items</Text>
            <Text style={styles.summaryValue}>{avoidableCount}</Text>
          </View>
        </View>

        {/* Category Breakdown */}
        <Text style={styles.sectionTitle}>Spending by Category</Text>

        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 2 }]}>Category</Text>
          <Text
            style={[styles.tableHeaderText, { flex: 1, textAlign: "right" }]}
          >
            Amount
          </Text>
        </View>

        {sortedCategories.map((cat, i) => (
          <View
            key={cat.categoryName}
            style={[styles.categoryRow, i % 2 !== 0 && styles.categoryRowAlt]}
          >
            <Text style={styles.categoryName}>{cat.categoryName}</Text>
            <Text style={styles.categoryAmount}>
              {cat.categoryAmount} {currency}
            </Text>
          </View>
        ))}

        {/* All Transactions */}
        <Text style={styles.sectionTitle}>All Transactions</Text>

        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.expenseDateCol]}>
            Date
          </Text>
          <Text style={[styles.tableHeaderText, styles.expenseCatCol]}>
            Category
          </Text>
          <Text style={[styles.tableHeaderText, styles.expenseComCol]}>
            Comment
          </Text>
          <Text style={[styles.tableHeaderText, styles.expenseAmtCol]}>
            Amount
          </Text>
          <Text style={[styles.tableHeaderText, styles.expenseAvdCol]}>Avoidable</Text>
        </View>

        {expenses.map((expense, i) => (
          <View
            key={expense.expenseId}
            style={[
              styles.expenseRow,
              i % 2 !== 0 && { backgroundColor: "#f8f9fa" },
            ]}
          >
            <Text style={styles.expenseDateCol}>{expense.entryDate}</Text>
            <Text style={styles.expenseCatCol}>{expense.category.name}</Text>
            <Text style={styles.expenseComCol}>{expense.comment || "-"}</Text>
            <Text style={styles.expenseAmtCol}>
              {expense.amount} {currency}
            </Text>
            <Text style={styles.expenseAvdCol}>
              {expense.couldHaveBeenAvoided ? "x" : ""}
            </Text>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>S90 / Expense Report / {month}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
