from .hooks import data

def dateformat(value, format="%d-%b-%Y"):
    return value.strftime(format)

# The value passed in should be a category name
def categories(value):
    if value == '*':
        return data['categories']
    
    for category in data['categories']:
        if category == value:
            return data['categories'][category]
        
    return []

# The value passed in should be a series name
# Mysteries will be returned in series order
def series(value):
    if value == '*':
        return data['series']
    
    for series in data['series']:
        if series == value:
            data['series'][series].sort(key=_series_order)
            
            return data['series'][series]
        
    return []

filters = {}
filters['dateformat'] = dateformat
filters['categories'] = categories
filters['series'] = series

def _series_order(item):
    return item['series']['order']
    