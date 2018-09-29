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

# The value passed in should be an author name
def authors(value):
    for author in data['authors']:
        if author == value:
            return data['authors'][author]['mysteries']
        
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

# The value passed in should be an author name
def name(value):
    for author in data['authors']:
        if author == value:
            return data['authors'][author]['author']['name']
        
    return []
    
filters = {}
filters['dateformat'] = dateformat
filters['categories'] = categories
filters['series'] = series
filters['authors'] = authors
filters['name'] = name

def _series_order(item):
    return item['series']['order']
    