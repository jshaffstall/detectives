from .hooks import data

def dateformat(value, format="%d-%b-%Y"):
    return value.strftime(format)

# The value passed in should be a category name
def categories(value):
    for category in data:
        if category == value:
            return data[category]
        
    return []

filters = {}
filters['dateformat'] = dateformat
filters['categories'] = categories
