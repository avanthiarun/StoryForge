from datetime import datetime

def extract_issues_summary(issues):
    """Extract summary stats from issues"""
    return {
        "total": len(issues),
        "by_status": count_by_field(issues, 'status'),
        "by_assignee": count_by_field(issues, 'assignee')
    }

def count_by_field(items, field):
    """Count items by a specific field"""
    counts = {}
    for item in items:
        value = item.get(field, 'Unknown')
        counts[value] = counts.get(value, 0) + 1
    return counts

def format_date(date_str):
    """Format date string"""
    try:
        dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        return dt.strftime('%Y-%m-%d %H:%M:%S')
    except:
        return date_str