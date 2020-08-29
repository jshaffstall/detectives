from .hooks import data

def dateformat(value, format="%d-%b-%Y"):
    return value.strftime(format)

def priceformat(value):
    # This returns an exception that makes no sense:
    # 'dict object' has no attribute 'price'
    # At this point value is a simple integer
    # and the return statement works, so the
    # exception is in the Jinja2 filter handling
    # Catching the exception here allows the formatted
    # string to be used properly.
    try:
        return "${:,.2f}".format(value/100)
    except Exception as ex:
        pass

def mysteries(value, which):
    # The value passed in should be a category slug
    if which == 'categories':
        for category in data['categories']:
            if category == value:
                return data['categories'][category]['mysteries']

    # The value passed in should be an author slug
    if which == 'author':
        for author in data['authors']:
            if author == value:
                return data['authors'][author]['mysteries']
                    
    return []

# The value passed in should be a series slug
# Mysteries will be returned in series order
def series(value):
    if value == '*':
        return data['series']
    
    for series in data['series']:
        if series == value:
            data['series'][series].sort(key=_series_order)
            
            return data['series'][series]
        
    return []

# The value passed in should be an author slug
def author(value):
    for author in data['authors']:
        if author == value:
            return data['authors'][author]['author']
        
    return []

# The value passed in should be a category slug
def category(value):
    for cat in data['categories']:
        if cat == value:
            return data['categories'][value]['category']
        
    return []
    
filters = {}
filters['dateformat'] = dateformat
filters['mysteries'] = mysteries
filters['series'] = series
filters['author'] = author
filters['category'] = category
filters['priceformat'] = priceformat

def _series_order(item):
    return item['series']['order']
    